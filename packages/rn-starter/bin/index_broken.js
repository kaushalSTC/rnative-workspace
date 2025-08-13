#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execa } = require('execa');
const chalk = require('chalk');
const os = require('os');
const readline = require('readline');

// Validation functions
const validateAppName = (name) => {
  // App name should be alphanumeric, can contain hyphens and underscores, 3-50 characters
  const appNameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{2,49}$/;
  return appNameRegex.test(name);
};

const validatePackageName = (packageName) => {
  // Package name format: com.organization.appname (reverse domain notation)
  // Allow both 2-segment (com.appname) and 3+ segment (com.organization.appname) formats
  const packageRegex = /^[a-z][a-z0-9]*(\.([a-z][a-z0-9]*))+$/;
  return packageRegex.test(packageName);
};

const isTwoSegmentPackage = (packageName) => {
  // Check if package name has only two segments (com.appname)
  return packageName.split('.').length === 2;
};

const validateAppScheme = (scheme) => {
  // App scheme should be lowercase alphanumeric, can contain hyphens, 3-20 characters
  const schemeRegex = /^[a-z][a-z0-9-]{2,19}$/;
  return schemeRegex.test(scheme);
};

const validateDomain = (domain) => {
  // Domain validation: basic format check
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/;
  return domainRegex.test(domain);
};

// Helper function for consistent yes/no questions
const askYesNoQuestion = async (rl, question, allowEmpty = true) => {
  const askQuestion = (question) => {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  };

  let response;
  do {
    response = await askQuestion(question);
    
    // If empty response and allowed, treat as 'no' (default)
    if (!response && allowEmpty) {
      return 'n';
    }
    
    // Check if response is valid
    const validResponses = ['y', 'yes', 'n', 'no'];
    if (response && validResponses.includes(response.toLowerCase())) {
      return response.toLowerCase();
    }
    
    // Invalid response, ask again
    console.error(chalk.red('❌ Invalid response. Please answer with: y/yes/n/no'));
    console.error(chalk.gray('Press Enter for default (N)'));
  } while (true);
};

// CLI-specific functions
const runCliWorkflow = async (appName, packageName, templateDir) => {
  const cwd = process.cwd();
  const appPath = path.join(cwd, appName);
  
  // Validate package name for CLI
  let finalPackageName = packageName;
  if (packageName) {
    if (!validatePackageName(packageName)) {
      console.error(chalk.red('❌ Invalid package name!'));
      console.error(chalk.yellow('Package name must:'));
      console.error(chalk.yellow('  - Use reverse domain notation'));
      console.error(chalk.yellow('  - Contain only lowercase letters and dots'));
      console.error(chalk.yellow('  - Have at least 2 segments'));
      console.error(chalk.gray('  Examples: com.company.appname, org.mycompany.myapp'));
      process.exit(1);
    }

    // CLI-specific package name validation with prompt for change
    if (isTwoSegmentPackage(packageName)) {
      console.log(chalk.red('\\n⚠️  CRITICAL WARNING: Two-segment package name detected!'));
      console.log(chalk.yellow('Package name "' + packageName + '" may cause SERIOUS issues with iOS development and deployment.'));
      console.log(chalk.yellow('Apple STRONGLY recommends using at least 3 segments (e.g., com.company.appname).'));
      console.log(chalk.red('\\n❌ Issues you WILL encounter:'));
      console.log(chalk.red('  - App Store submission REJECTIONS'));
      console.log(chalk.red('  - TestFlight distribution failures'));
      console.log(chalk.red('  - Xcode signing complications'));
      console.log(chalk.red('  - Deep linking configuration problems'));
      
      console.log(chalk.cyan('\\n🔧 IMPORTANT: After React Native CLI initialization, changing the package name'));
      console.log(chalk.cyan('requires manual modification of native Android/iOS files, which is time-consuming.'));
      
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const updatePackage = await askYesNoQuestion(rl, chalk.cyan('\\nDo you want to update your package name NOW to avoid iOS issues? (Y/n): '));
      
      if (updatePackage.toLowerCase() !== 'n' && updatePackage.toLowerCase() !== 'no') {
        let newPackageName;
        do {
          const segments = packageName.split('.');
          const suggestedName = `${segments[0]}.company.${segments[1]}`;
          newPackageName = await new Promise((resolve) => {
            rl.question(chalk.cyan(`Enter a new package name (suggestion: ${suggestedName}): `), (answer) => {
              resolve(answer.trim());
            });
          });
          
          if (newPackageName && !validatePackageName(newPackageName)) {
            console.error(chalk.red('❌ Invalid package name format!'));
            console.error(chalk.yellow('Please use reverse domain notation (e.g., com.company.appname)'));
            newPackageName = null;
          } else if (newPackageName && isTwoSegmentPackage(newPackageName)) {
            console.error(chalk.yellow('⚠️  Still a 2-segment package name. Consider using 3+ segments.'));
            const keepAnyway = await askYesNoQuestion(rl, chalk.cyan('Use this package name anyway? (y/N): '));
            if (keepAnyway.toLowerCase() !== 'y' && keepAnyway.toLowerCase() !== 'yes') {
              newPackageName = null;
            }
          }
        } while (newPackageName !== null && !validatePackageName(newPackageName));
        
        if (newPackageName) {
          finalPackageName = newPackageName;
          console.log(chalk.green(`✅ Updated package name to: ${finalPackageName}`));
        } else {
          console.log(chalk.red('\\n❌ Cancelled. Please provide a valid package name.'));
          process.exit(1);
        }
      } else {
        console.log(chalk.yellow('\\n⚠️  Proceeding with 2-segment package name at your own risk.'));
        console.log(chalk.red('Remember: Changing this later requires manual native file modifications!'));
      }
      
      rl.close();
    }
  }

  // Step 1: Initialize React Native app
  console.log(chalk.cyan(`🚀 Initializing React Native CLI app '${appName}'...`));

  const initArgs = ['@react-native-community/cli', 'init', appName];
  if (finalPackageName) {
    initArgs.push('--package-name', finalPackageName);
  }

  await execa('npx', initArgs, { cwd: cwd, stdio: 'inherit' });

  // Step 2: Remove files/folders to override
  console.log(chalk.cyan('🔧 Setting up custom template files...'));
  const toRemove = ['App.tsx', 'README.md', 'babel.config.js', 'assets', 'src'];
  for (const item of toRemove) {
    const targetPath = path.join(appPath, item);
    if (await fs.pathExists(targetPath)) {
      await fs.remove(targetPath);
    }
  }

  // Step 3: Copy files from overrides-cli/
  await fs.copy(templateDir, appPath, { overwrite: true, recursive: true });

  return { appPath, finalPackageName };
};

// Expo-specific functions  
const runExpoWorkflow = async (appName, packageName, templateDir) => {
  const cwd = process.cwd();
  const appPath = path.join(cwd, appName);
  
  // Validate package name for Expo
  let finalPackageName = packageName;
  if (packageName && !validatePackageName(packageName)) {
    console.error(chalk.red('❌ Invalid package name!'));
    console.error(chalk.yellow('Package name must:'));
    console.error(chalk.yellow('  - Use reverse domain notation'));
    console.error(chalk.yellow('  - Contain only lowercase letters and dots'));
    console.error(chalk.yellow('  - Have at least 2 segments'));
    console.error(chalk.gray('  Examples: com.company.appname, org.mycompany.myapp'));
    process.exit(1);
  }

  // Step 1: Initialize Expo app
  console.log(chalk.cyan(`🚀 Initializing Expo app '${appName}'...`));
  await execa('npx', ['create-expo-app', appName], { cwd: cwd, stdio: 'inherit' });

  // Step 2: Remove files/folders to override
  console.log(chalk.cyan('🧹 Cleaning up default Expo files...'));
  const toRemove = ['App.tsx', 'README.md', 'babel.config.js', 'tsconfig.json', 'pnpm-workspace.yaml', 'src', 'app', 'constants', 'components', 'hooks', 'scripts'];
  for (const item of toRemove) {
    const targetPath = path.join(appPath, item);
    try {
      if (await fs.pathExists(targetPath)) {
        await fs.remove(targetPath);
        console.log(chalk.gray(`   ✓ Removed ${item}`));
      }
    } catch (error) {
      console.log(chalk.yellow(`   ⚠️  Failed to remove ${item}: ${error.message}`));
    }
  }

  // Step 3: Copy files from overrides-expo/
  console.log(chalk.cyan('📋 Copying template files...'));
  await fs.copy(templateDir, appPath, { 
    overwrite: true, 
    recursive: true,
    filter: (src, dest) => {
      const relativePath = path.relative(templateDir, src);
      if (relativePath) {
        console.log(chalk.gray(`     Copying: ${relativePath}`));
      }
      return !relativePath.endsWith('.env');
    }
  });
  
  // Handle environment file
  console.log(chalk.cyan('🔧 Setting up environment file...'));
  const envExamplePath = path.join(templateDir, '.env.example');
  const envPath = path.join(appPath, '.env');
  
  if (await fs.pathExists(envExamplePath)) {
    await fs.copy(envExamplePath, envPath);
    console.log(chalk.green('✅ Created .env file from .env.example template'));
  }

  // Handle Expo-specific package name configuration
  if (packageName) {
    if (isTwoSegmentPackage(packageName)) {
      console.log(chalk.yellow('⚠️  WARNING: Two-segment package name detected!'));
      console.log(chalk.yellow('Package name "' + packageName + '" may cause issues with iOS development and deployment.'));
      console.log(chalk.yellow('Apple recommends using at least 3 segments (e.g., com.company.appname).'));
      
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const updatePackage = await new Promise((resolve) => {
        rl.question(chalk.cyan('Would you like to update your package name to avoid iOS issues? (y/N): '), (answer) => {
          resolve(answer.trim());
        });
      });
      
      if (updatePackage.toLowerCase() === 'y' || updatePackage.toLowerCase() === 'yes') {
        let newPackageName;
        do {
          const segments = packageName.split('.');
          const suggestedName = `${segments[0]}.company.${segments[1]}`;
          newPackageName = await new Promise((resolve) => {
            rl.question(chalk.cyan(`Enter a new package name (suggestion: ${suggestedName}): `), (answer) => {
              resolve(answer.trim());
            });
          });
          
          if (newPackageName && !validatePackageName(newPackageName)) {
            console.error(chalk.red('❌ Invalid package name format!'));
            console.error(chalk.yellow('Please use reverse domain notation (e.g., com.company.appname)'));
            newPackageName = null;
          }
        } while (newPackageName !== null && !validatePackageName(newPackageName));
        
        if (newPackageName) {
          finalPackageName = newPackageName;
          console.log(chalk.green(`✅ Updated package name to: ${finalPackageName}`));
        }
      }
      
      rl.close();
    }
    
    // Update app.json with package name
    const appJsonPath = path.join(appPath, 'app.json');
    if (await fs.pathExists(appJsonPath)) {
      const appJson = await fs.readJson(appJsonPath);
      
      if (!appJson.expo.ios) {
        appJson.expo.ios = {};
      }
      appJson.expo.ios.bundleIdentifier = finalPackageName;
      
      if (!appJson.expo.android) {
        appJson.expo.android = {};
      }
      appJson.expo.android.package = finalPackageName;
      
      await fs.writeJson(appJsonPath, appJson, { spaces: 2 });
      console.log(chalk.green(`✅ Updated bundle identifier and package to: ${finalPackageName}`));
    }
  }

  return { appPath, finalPackageName };
};

async function run() {
  const appName = process.argv[2];
  const packageName = process.argv[3]; // optional

  console.log(chalk.cyan.bold('🚀 React Native Unified Starter'));
  console.log(chalk.gray('Choose between React Native CLI or Expo to get started!\n'));

  if (!appName) {
    console.error(chalk.red('❌ Please provide an app name.\\nUsage: rn-starter AppName [com.organization.appname]'));
    process.exit(1);
  }

  // Validate app name
  if (!validateAppName(appName)) {
    console.error(chalk.red('❌ Invalid app name!'));
    console.error(chalk.yellow('App name must:'));
    console.error(chalk.yellow('  - Start with a letter'));
    console.error(chalk.yellow('  - Be 3-50 characters long'));
    console.error(chalk.yellow('  - Contain only letters, numbers, hyphens, and underscores'));
    console.error(chalk.gray('  Examples: MyApp, my-app, My_App_2024'));
    process.exit(1);
  }

  // Step 1: Choose platform
  console.log(chalk.cyan('📱 Choose your React Native platform:'));
  console.log(chalk.yellow('1. React Native CLI (Bare React Native with full native access)'));
  console.log(chalk.yellow('2. Expo (Managed workflow with simplified development)'));
  console.log('');
  console.log(chalk.gray('React Native CLI is recommended for apps requiring custom native modules,'));
  console.log(chalk.gray('while Expo is great for rapid prototyping and apps using mostly standard features.'));
  console.log('');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let platformChoice;
  do {
    platformChoice = await new Promise((resolve) => {
      rl.question(chalk.cyan('Enter your choice (1 for CLI, 2 for Expo): '), (answer) => {
        resolve(answer.trim());
      });
    });

    if (platformChoice === '1' || platformChoice === '2') {
      break;
    }

    console.error(chalk.red('❌ Invalid choice. Please enter 1 for CLI or 2 for Expo.'));
  } while (true);

  rl.close();

  const isExpo = platformChoice === '2';
  const templateDir = path.resolve(__dirname, isExpo ? '../overrides-expo' : '../overrides-cli');
  
  console.log(chalk.green(`\\n✅ Selected: ${isExpo ? 'Expo' : 'React Native CLI'}`));

  try {
    let appPath, finalPackageName;
    
    if (isExpo) {
      ({ appPath, finalPackageName } = await runExpoWorkflow(appName, packageName, templateDir));
    } else {
      ({ appPath, finalPackageName } = await runCliWorkflow(appName, packageName, templateDir));
    }

    // Common steps for both workflows
    await runCommonSetup(appPath, appName, finalPackageName, isExpo, templateDir);

    console.log(chalk.green(`\\n✅ Project '${appName}' is ready! 🚀`));
    console.log(chalk.cyan(`Platform: ${isExpo ? 'Expo' : 'React Native CLI'}`));

    // Change to project directory
    process.chdir(appPath);
    console.log(chalk.cyan(`\\n📁 Changed to project directory: ${appName}`));

    // Provide platform-specific instructions
    if (isExpo) {
      provideExpoInstructions();
    } else {
      provideCLIInstructions();
    }

  } catch (err) {
    console.error(chalk.red('❌ An error occurred:'), err);
    process.exit(1);
  }
}

// Common setup function for both workflows
const runCommonSetup = async (appPath, appName, finalPackageName, isExpo, templateDir) => {
  // Merge package.json scripts
  console.log(chalk.cyan('📝 Adding comprehensive npm scripts...'));
  const packageJsonPath = path.join(appPath, 'package.json');
  const scriptsTemplatePath = path.join(templateDir, 'package.json.template');
  
  if (await fs.pathExists(packageJsonPath) && await fs.pathExists(scriptsTemplatePath)) {
    const packageJson = await fs.readJson(packageJsonPath);
    const scriptsTemplate = await fs.readJson(scriptsTemplatePath);
    
    let scriptsTemplateStr = JSON.stringify(scriptsTemplate);
    scriptsTemplateStr = scriptsTemplateStr.replace(/{{APP_NAME}}/g, appName);
    const processedScriptsTemplate = JSON.parse(scriptsTemplateStr);
    
    packageJson.scripts = { ...packageJson.scripts, ...processedScriptsTemplate.scripts };
    
    if (isExpo && processedScriptsTemplate.expo) {
      packageJson.expo = { ...packageJson.expo, ...processedScriptsTemplate.expo };
    }
    
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    console.log(chalk.green('✅ Added comprehensive npm scripts to package.json'));
  }

  // Install dependencies based on platform
  if (isExpo) {
    await installExpoDependencies(appPath);
  } else {
    await installCLIDependencies(appPath);
  }

  // Configure deep linking
  await configureDeepLinking(appPath, appName, finalPackageName, isExpo);

  // Setup git repository
  await setupGitRepository(appPath, appName, finalPackageName, isExpo);

  // Clean up template files
  console.log(chalk.cyan('🧹 Cleaning up template files...'));
  const packageJsonTemplatePath = path.join(appPath, 'package.json.template');
  if (await fs.pathExists(packageJsonTemplatePath)) {
    await fs.remove(packageJsonTemplatePath);
    console.log(chalk.gray('   ✓ Removed package.json.template'));
  }
};

// Install CLI-specific dependencies
const installCLIDependencies = async (appPath) => {
  const group1 = [
    '@react-native-async-storage/async-storage',
    'react-native-size-matters',
    'react-native-vector-icons',
    'react-native-paper',
    'react-native-toast-message',
  ];

  const group2 = [
    '@react-navigation/native',
    '@react-navigation/stack',
    'react-native-gesture-handler',
    'react-native-reanimated',
    'react-native-safe-area-context',
    'react-native-screens',
    'react-native-worklets',
  ];

  const group3 = [
    'react-native-dotenv',
    '@reduxjs/toolkit',
    'react-redux',
  ];

  console.log(chalk.green(`📦 Installing UI & utility dependencies: ${group1.join(', ')}...`));
  await execa('npm', ['install', ...group1], { cwd: appPath, stdio: 'inherit' });

  console.log(chalk.green(`📦 Installing navigation dependencies: ${group2.join(', ')}...`));
  await execa('npm', ['install', ...group2], { cwd: appPath, stdio: 'inherit' });

  console.log(chalk.green(`📦 Installing state management dependencies: ${group3.join(', ')}...`));
  await execa('npm', ['install', ...group3], { cwd: appPath, stdio: 'inherit' });

  // Configure fonts.gradle for CLI
  const buildGradlePath = path.join(appPath, 'android', 'app', 'build.gradle');
  const fontGradleLine = 'apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")';

  if (await fs.pathExists(buildGradlePath)) {
    let gradleContent = await fs.readFile(buildGradlePath, 'utf8');
    if (!gradleContent.includes(fontGradleLine)) {
      gradleContent = `${gradleContent.trim()}\\n\\n${fontGradleLine}\\n`;
      await fs.writeFile(buildGradlePath, gradleContent, 'utf8');
      console.log(chalk.green('➕ Added fonts.gradle line to android/app/build.gradle'));
    }
  }
};

// Install Expo-specific dependencies
const installExpoDependencies = async (appPath) => {
  const group1 = [
    '@react-native-async-storage/async-storage',
    'react-native-size-matters',
    '@expo/vector-icons',
    'react-native-paper',
    'react-native-toast-message',
  ];

  const group2 = [
    '@react-navigation/native',
    '@react-navigation/stack',
    'react-native-gesture-handler',
    'react-native-reanimated',
    'react-native-safe-area-context',
    'react-native-screens',
  ];

  const group3 = [
    '@reduxjs/toolkit',
    'react-redux',
  ];

  const installWithRetry = async (dependencies, description) => {
    try {
      console.log(chalk.green(`Installing ${description}: ${dependencies.join(', ')}...`));
      await execa('npx', ['expo', 'install', ...dependencies], { cwd: appPath, stdio: 'inherit' });
      console.log(chalk.green(`✅ ${description} installed successfully!`));
    } catch (error) {
      console.log(chalk.yellow(`⚠️  Installation failed for ${description}. You can install manually later.`));
      console.log(chalk.gray(`   npx expo install ${dependencies.join(' ')}`));
    }
  };

  await installWithRetry(group1, 'UI & utility dependencies');
  await installWithRetry(group2, 'navigation dependencies');
  await installWithRetry(group3, 'state management dependencies');
};

// Configure deep linking for both platforms
const configureDeepLinking = async (appPath, appName, finalPackageName, isExpo) => {
  console.log(chalk.cyan('🔗 Setting up deep linking configuration...'));
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const configureAppScheme = await askYesNoQuestion(rl, chalk.cyan('📱 Do you want to configure a custom app scheme for deep linking? (y/N): '));
  let appScheme = null;
  let universalLinkDomain = null;
  
  if (configureAppScheme === 'y' || configureAppScheme === 'yes') {
    do {
      appScheme = await new Promise((resolve) => {
        rl.question(chalk.cyan(`🔤 Enter your app scheme (e.g., "${appName.toLowerCase()}", "myapp"): `), (answer) => {
          resolve(answer.trim());
        });
      });
      
      if (!appScheme) {
        console.log(chalk.yellow('Skipping app scheme configuration.'));
        break;
      }
      
      if (!validateAppScheme(appScheme)) {
        console.error(chalk.red('❌ Invalid app scheme!'));
        console.error(chalk.yellow('App scheme must:'));
        console.error(chalk.yellow('  - Start with a letter'));
        console.error(chalk.yellow('  - Be 3-20 characters long'));
        console.error(chalk.yellow('  - Contain only lowercase letters, numbers, and hyphens'));
        console.error(chalk.gray(`  Examples: ${appName.toLowerCase()}, myapp, my-app`));
        appScheme = null;
      }
    } while (appScheme !== null && !validateAppScheme(appScheme));
    
    if (appScheme) {
      const configureUniversalLinks = await askYesNoQuestion(rl, chalk.cyan('🌐 Do you want to configure universal links? (y/N): '));
      
      if (configureUniversalLinks === 'y' || configureUniversalLinks === 'yes') {
        do {
          universalLinkDomain = await new Promise((resolve) => {
            rl.question(chalk.cyan(`🔗 Enter your domain for universal links (e.g., "${appName.toLowerCase()}.com", "myapp.com"): `), (answer) => {
              resolve(answer.trim());
            });
          });
          
          if (!universalLinkDomain) {
            console.log(chalk.yellow('Skipping universal links configuration.'));
            break;
          }
          
          if (!validateDomain(universalLinkDomain)) {
            console.error(chalk.red('❌ Invalid domain!'));
            console.error(chalk.yellow('Domain must:'));
            console.error(chalk.yellow('  - Be a valid domain format'));
            console.error(chalk.yellow('  - Include a top-level domain (.com, .org, etc.)'));
            console.error(chalk.gray(`  Examples: ${appName.toLowerCase()}.com, mycompany.org, app.example.io`));
            universalLinkDomain = null;
          }
        } while (universalLinkDomain !== null && !validateDomain(universalLinkDomain));
      }
    }
  }
  
  rl.close();

  if (appScheme) {
    if (isExpo) {
      await configureExpoDeepLinking(appPath, appScheme, universalLinkDomain);
    } else {
      await configureCLIDeepLinking(appPath, appName, finalPackageName, appScheme, universalLinkDomain);
    }
    
    console.log(chalk.green('✅ Deep linking configuration completed!'));
    if (appScheme) {
      console.log(chalk.gray(`   📱 App scheme: ${appScheme}://`));
    }
    if (universalLinkDomain) {
      console.log(chalk.gray(`   🌐 Universal links: https://${universalLinkDomain}`));
    }
  }
};

// Configure Expo deep linking
const configureExpoDeepLinking = async (appPath, appScheme, universalLinkDomain) => {
  const appJsonPath = path.join(appPath, 'app.json');
  if (await fs.pathExists(appJsonPath)) {
    const appJson = await fs.readJson(appJsonPath);
    
    appJson.expo.scheme = appScheme;
    
    if (!appJson.expo.android) {
      appJson.expo.android = {};
    }
    
    const intentFilters = [];
    
    if (universalLinkDomain) {
      intentFilters.push({
        "action": "VIEW",
        "autoVerify": true,
        "data": [
          { "scheme": "https", "host": universalLinkDomain }
        ],
        "category": ["BROWSABLE", "DEFAULT"]
      });
    }
    
    intentFilters.push({
      "action": "VIEW",
      "data": [
        { "scheme": appScheme }
      ],
      "category": ["BROWSABLE", "DEFAULT"]
    });
    
    appJson.expo.android.intentFilters = intentFilters;
    
    if (universalLinkDomain) {
      if (!appJson.expo.ios) {
        appJson.expo.ios = {};
      }
      const associatedDomain = `applinks:${universalLinkDomain}`;
      appJson.expo.ios.associatedDomains = [associatedDomain];
    }
    
    await fs.writeJson(appJsonPath, appJson, { spaces: 2 });
    console.log(chalk.green('✅ Deep linking configuration added to app.json'));
  }
};

// Configure CLI deep linking
const configureCLIDeepLinking = async (appPath, appName, finalPackageName, appScheme, universalLinkDomain) => {
  console.log(chalk.cyan('⚙️  Configuring deep linking in native files...'));
  
  // Configure Android
  const androidManifestPath = path.join(appPath, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
  if (await fs.pathExists(androidManifestPath)) {
    try {
      let manifestContent = await fs.readFile(androidManifestPath, 'utf8');
      
      const activityRegex = /(\<activity[\s\S]*?android:name="\.MainActivity"[\s\S]*?\>)([\s\S]*?)(\<\/activity\>)/;
      const match = manifestContent.match(activityRegex);
      
      if (match) {
        let activityContent = match[2];
        let intentFilters = '';
        
        if (universalLinkDomain) {
          intentFilters += `\\n        \\<intent-filter android:autoVerify="true"\\>
            \\<action android:name="android.intent.action.VIEW" /\\>
            \\<category android:name="android.intent.category.DEFAULT" /\\>
            \\<category android:name="android.intent.category.BROWSABLE" /\\>
            \\<data android:scheme="https" android:host="${universalLinkDomain}" /\\>
        \\</intent-filter\\>`;
        }
        
        intentFilters += `\\n        \\<intent-filter\\>
            \\<action android:name="android.intent.action.VIEW" /\\>
            \\<category android:name="android.intent.category.DEFAULT" /\\>
            \\<category android:name="android.intent.category.BROWSABLE" /\\>
            \\<data android:scheme="${appScheme}" /\\>
        \\</intent-filter\\>`;
        
        if (!activityContent.includes(`android:scheme="${appScheme}"`)) {
          activityContent += intentFilters;
          manifestContent = manifestContent.replace(match[0], match[1] + activityContent + match[3]);
          await fs.writeFile(androidManifestPath, manifestContent, 'utf8');
          console.log(chalk.green('✅ Android deep linking configured in AndroidManifest.xml'));
        }
      }
    } catch (error) {
      console.log(chalk.red('❌ Failed to configure Android deep linking:'), error.message);
    }
  }
  
  // Configure iOS
  const iosPlistPath = path.join(appPath, 'ios', appName, 'Info.plist');
  if (await fs.pathExists(iosPlistPath)) {
    try {
      let plistContent = await fs.readFile(iosPlistPath, 'utf8');
      
      const urlSchemesConfig = `\\t\\<key\\>CFBundleURLTypes\\</key\\>
\\t\\<array\\>
\\t\\t\\<dict\\>
\\t\\t\\t\\<key\\>CFBundleURLName\\</key\\>
\\t\\t\\t\\<string\\>${finalPackageName || appName.toLowerCase()}\\</string\\>
\\t\\t\\t\\<key\\>CFBundleURLSchemes\\</key\\>
\\t\\t\\t\\<array\\>
\\t\\t\\t\\t\\<string\\>${appScheme}\\</string\\>
\\t\\t\\t\\</array\\>
\\t\\t\\</dict\\>
\\t\\</array\\>`;
      
      if (!plistContent.includes('CFBundleURLTypes')) {
        const insertionPoint = plistContent.lastIndexOf('\\</dict\\>\\n\\</plist\\>');
        if (insertionPoint !== -1) {
          plistContent = plistContent.slice(0, insertionPoint) + urlSchemesConfig + '\\n' + plistContent.slice(insertionPoint);
          
          if (universalLinkDomain) {
            const associatedDomainsConfig = `\\t\\<key\\>com.apple.developer.associated-domains\\</key\\>
\\t\\<array\\>
\\t\\t\\<string\\>applinks:${universalLinkDomain}\\</string\\>
\\t\\</array\\>\\n`;
            
            plistContent = plistContent.slice(0, insertionPoint) + associatedDomainsConfig + plistContent.slice(insertionPoint);
          }
          
          await fs.writeFile(iosPlistPath, plistContent, 'utf8');
          console.log(chalk.green('✅ iOS deep linking configured in Info.plist'));
        }
      }
    } catch (error) {
      console.log(chalk.red('❌ Failed to configure iOS deep linking:'), error.message);
    }
  }
};

// Setup git repository
const setupGitRepository = async (appPath, appName, finalPackageName, isExpo) => {
  console.log(chalk.cyan('📋 Setting up git repository...'));
  
  try {
    const gitPath = path.join(appPath, '.git');
    const hasGit = await fs.pathExists(gitPath);
    
    if (!hasGit) {
      await execa('git', ['init'], { cwd: appPath, stdio: 'pipe' });
    }
    
    if (isExpo) {
      // Reset Expo's git history
      await execa('git', ['reset', '--hard'], { cwd: appPath, stdio: 'pipe' });
      await execa('git', ['update-ref', '-d', 'HEAD'], { cwd: appPath, stdio: 'pipe' });
    }
    
    await execa('git', ['add', '.'], { cwd: appPath, stdio: 'pipe' });
    
    const commitMessage = `🎆 Initial commit: ${appName}

🚀 Generated and configured with rn-starter
✨ Platform: ${isExpo ? 'Expo' : 'React Native CLI'}
✨ Includes: Navigation, Redux, UI components, build scripts, and more!

📎 Template: @kaushalstc/rn-starter
🔗 Repository: https://github.com/kaushalSTC/rn-starter

💡 Use 'npx @kaushalstc/rn-starter' for latest version`;
    
    await execa('git', ['commit', '-m', commitMessage], { cwd: appPath, stdio: 'pipe' });
    console.log(chalk.green('✅ Git repository configured with custom initial commit'));
  } catch (error) {
    console.log(chalk.yellow('⚠️  Git configuration failed (this is optional):'), error.message);
  }
};

// Provide CLI-specific instructions
const provideCLIInstructions = () => {
  console.log(chalk.yellow(`\\n🚀 Next steps:`));
  console.log(chalk.yellow(`1. To run on iOS: npx react-native run-ios`));
  console.log(chalk.yellow(`2. To run on Android: npx react-native run-android`));
  console.log(chalk.yellow(`3. To start Metro bundler: npm start`));
  
  console.log(chalk.cyan(`\\n🏢 Available NPM Scripts:`));
  console.log(chalk.gray(`• Development: npm start, npm run android, npm run ios`));
  console.log(chalk.gray(`• Building: npm run build:android, npm run build:ios`));
  console.log(chalk.gray(`• Cleaning: npm run clean, npm run clean:android, npm run clean:ios`));
  
  if (os.platform() === 'darwin') {
    console.log(chalk.yellow('\\n🍎 Detected macOS - iOS development available'));
    console.log(chalk.cyan('📱 Don\\'t forget to run: npx pod-install'));
  }
};

// Provide Expo-specific instructions
const provideExpoInstructions = () => {
  console.log(chalk.yellow(`\\n🚀 Next steps:`));
  console.log(chalk.yellow(`1. To start development server: npm start`));
  console.log(chalk.yellow(`2. To run on iOS: npm run ios`));
  console.log(chalk.yellow(`3. To run on Android: npm run android`));
  console.log(chalk.yellow(`4. To run on Web: npm run web`));
  
  console.log(chalk.cyan(`\\n🏢 EAS Build Commands:`));
  console.log(chalk.gray(`• Development build: npm run build:development`));
  console.log(chalk.gray(`• Preview build: npm run build:preview`));
  console.log(chalk.gray(`• Production build: npm run build:production`));
  console.log(chalk.gray(`• Submit to stores: npm run submit:production`));
};

run();
