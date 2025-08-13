#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execa } = require('execa');
const chalk = require('chalk');
const os = require('os');
const readline = require('readline');

// Validation functions
const validateAppName = (name) => {
  const appNameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{2,49}$/;
  return appNameRegex.test(name);
};

const validatePackageName = (packageName) => {
  const packageRegex = /^[a-z][a-z0-9]*(\.([a-z][a-z0-9]*))+$/;
  return packageRegex.test(packageName);
};

const isTwoSegmentPackage = (packageName) => {
  return packageName.split('.').length === 2;
};

const validateAppScheme = (scheme) => {
  const schemeRegex = /^[a-z][a-z0-9-]{2,19}$/;
  return schemeRegex.test(scheme);
};

const validateDomain = (domain) => {
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
    
    if (!response && allowEmpty) {
      return 'n';
    }
    
    const validResponses = ['y', 'yes', 'n', 'no'];
    if (response && validResponses.includes(response.toLowerCase())) {
      return response.toLowerCase();
    }
    
    console.error(chalk.red('❌ Invalid response. Please answer with: y/yes/n/no'));
    console.error(chalk.gray('Press Enter for default (N)'));
  } while (true);
};

// CLI-specific functions
const runCliWorkflow = async (appName, packageName, templateDir) => {
  const cwd = process.cwd();
  const appPath = path.join(cwd, appName);
  
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

    if (isTwoSegmentPackage(packageName)) {
      console.log(chalk.red('\n⚠️  CRITICAL WARNING: Two-segment package name detected!'));
      console.log(chalk.yellow('Package name "' + packageName + '" may cause SERIOUS issues with iOS development and deployment.'));
      console.log(chalk.yellow('Apple STRONGLY recommends using at least 3 segments (e.g., com.company.appname).'));
      
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const updatePackage = await askYesNoQuestion(rl, chalk.cyan('\nDo you want to update your package name NOW to avoid iOS issues? (Y/n): '));
      
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
          console.log(chalk.red('\n❌ Cancelled. Please provide a valid package name.'));
          process.exit(1);
        }
      } else {
        console.log(chalk.yellow('\n⚠️  Proceeding with 2-segment package name at your own risk.'));
        console.log(chalk.red('Remember: Changing this later requires manual native file modifications!'));
      }
      
      rl.close();
    }
  }

  // Initialize React Native app
  console.log(chalk.cyan(`🚀 Initializing React Native CLI app '${appName}'...`));

  const initArgs = ['@react-native-community/cli', 'init', appName];
  if (finalPackageName) {
    initArgs.push('--package-name', finalPackageName);
  }

  await execa('npx', initArgs, { cwd: cwd, stdio: 'inherit' });

  // Remove files/folders to override
  console.log(chalk.cyan('🔧 Setting up custom template files...'));
  const toRemove = ['App.tsx', 'README.md', 'babel.config.js', 'assets', 'src'];
  for (const item of toRemove) {
    const targetPath = path.join(appPath, item);
    if (await fs.pathExists(targetPath)) {
      await fs.remove(targetPath);
    }
  }

  // Copy files from overrides-cli/
  await fs.copy(templateDir, appPath, { overwrite: true, recursive: true });

  return { appPath, finalPackageName };
};

// Expo-specific functions  
const runExpoWorkflow = async (appName, packageName, templateDir) => {
  const cwd = process.cwd();
  const appPath = path.join(cwd, appName);
  
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

  // Initialize Expo app
  console.log(chalk.cyan(`🚀 Initializing Expo app '${appName}'...`));
  await execa('npx', ['create-expo-app', appName], { cwd: cwd, stdio: 'inherit' });

  // Remove files/folders to override
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

  // Copy files from overrides-expo/
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

  // Handle Expo package name configuration
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

// Parse command line arguments and flags
const parseArgs = () => {
  const args = process.argv.slice(2);
  const flags = {
    cli: false,
    expo: false,
    help: false
  };
  const nonFlagArgs = [];

  for (const arg of args) {
    if (arg === '--cli') {
      flags.cli = true;
    } else if (arg === '--expo') {
      flags.expo = true;
    } else if (arg === '--help' || arg === '-h') {
      flags.help = true;
    } else if (!arg.startsWith('-')) {
      nonFlagArgs.push(arg);
    }
  }

  return { flags, nonFlagArgs };
};

const showHelp = () => {
  console.log(chalk.cyan.bold('🚀 React Native Unified Starter'));
  console.log(chalk.gray('Bootstrap a custom React Native app with your choice of CLI or Expo\n'));
  
  console.log(chalk.yellow('Usage:'));
  console.log('  npx @kaushalstc/rn-starter <AppName> [packageName] [flags]\n');
  
  console.log(chalk.yellow('Arguments:'));
  console.log('  AppName       Name of the app to create (required)');
  console.log('  packageName   Bundle identifier (optional, e.g., com.company.appname)\n');
  
  console.log(chalk.yellow('Flags:'));
  console.log('  --cli         Skip platform selection, use React Native CLI');
  console.log('  --expo        Skip platform selection, use Expo');
  console.log('  --help, -h    Show this help message\n');
  
  console.log(chalk.yellow('Examples:'));
  console.log('  npx @kaushalstc/rn-starter MyApp');
  console.log('  npx @kaushalstc/rn-starter MyApp com.company.myapp');
  console.log('  npx @kaushalstc/rn-starter MyApp --cli');
  console.log('  npx @kaushalstc/rn-starter MyApp com.company.myapp --expo');
  console.log('  npx @kaushalstc/rn-starter MyApp --help\n');
  
  console.log(chalk.gray('Without flags, you\'ll be prompted to choose between CLI and Expo interactively.'));
};

async function run() {
  const { flags, nonFlagArgs } = parseArgs();
  const appName = nonFlagArgs[0];
  const packageName = nonFlagArgs[1]; // optional

  // Show help if requested
  if (flags.help) {
    showHelp();
    process.exit(0);
  }

  // Validate conflicting flags
  if (flags.cli && flags.expo) {
    console.error(chalk.red('❌ Cannot use both --cli and --expo flags together.'));
    console.error(chalk.yellow('Please choose one platform or omit flags for interactive selection.'));
    process.exit(1);
  }

  console.log(chalk.cyan.bold('🚀 React Native Unified Starter'));
  if (!flags.cli && !flags.expo) {
    console.log(chalk.gray('Choose between React Native CLI or Expo to get started!\n'));
  }

  if (!appName) {
    console.error(chalk.red('❌ Please provide an app name.'));
    console.error(chalk.yellow('Usage: rn-starter AppName [com.organization.appname] [--cli|--expo]'));
    console.error(chalk.gray('Use --help for more information.'));
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

  // Determine platform based on flags or interactive selection
  let isExpo;
  
  if (flags.cli) {
    isExpo = false;
    console.log(chalk.green('✅ Using React Native CLI (--cli flag)'));
  } else if (flags.expo) {
    isExpo = true;
    console.log(chalk.green('✅ Using Expo (--expo flag)'));
  } else {
    // Interactive platform selection
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

    isExpo = platformChoice === '2';
    console.log(chalk.green(`\n✅ Selected: ${isExpo ? 'Expo' : 'React Native CLI'}`));
  }

  const templateDir = path.resolve(__dirname, isExpo ? '../overrides-expo' : '../overrides-cli');

  try {
    let appPath, finalPackageName;
    
    if (isExpo) {
      ({ appPath, finalPackageName } = await runExpoWorkflow(appName, packageName, templateDir));
    } else {
      ({ appPath, finalPackageName } = await runCliWorkflow(appName, packageName, templateDir));
    }

    // Common steps for both workflows
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
      console.log(chalk.cyan('📦 Installing Expo dependencies...'));
      const expoGroups = [
        ['@react-native-async-storage/async-storage', 'react-native-size-matters', '@expo/vector-icons', 'react-native-paper', 'react-native-toast-message'],
        ['@react-navigation/native', '@react-navigation/stack', 'react-native-gesture-handler', 'react-native-reanimated', 'react-native-safe-area-context', 'react-native-screens'],
        ['@reduxjs/toolkit', 'react-redux']
      ];
      
      for (const group of expoGroups) {
        try {
          await execa('npx', ['expo', 'install', ...group], { cwd: appPath, stdio: 'inherit' });
        } catch (error) {
          console.log(chalk.yellow(`⚠️  Some dependencies failed to install. You can install them manually later.`));
        }
      }
    } else {
      console.log(chalk.cyan('📦 Installing CLI dependencies...'));
      const cliGroups = [
        ['@react-native-async-storage/async-storage', 'react-native-size-matters', 'react-native-vector-icons', 'react-native-paper', 'react-native-toast-message'],
        ['@react-navigation/native', '@react-navigation/stack', 'react-native-gesture-handler', 'react-native-reanimated', 'react-native-safe-area-context', 'react-native-screens', 'react-native-worklets'],
        ['react-native-dotenv', '@reduxjs/toolkit', 'react-redux']
      ];
      
      for (const group of cliGroups) {
        try {
          await execa('npm', ['install', ...group], { cwd: appPath, stdio: 'inherit' });
        } catch (error) {
          console.log(chalk.yellow(`⚠️  Some dependencies failed to install. You can install them manually later.`));
        }
      }

      // Configure fonts.gradle for CLI
      const buildGradlePath = path.join(appPath, 'android', 'app', 'build.gradle');
      const fontGradleLine = 'apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")';

      if (await fs.pathExists(buildGradlePath)) {
        let gradleContent = await fs.readFile(buildGradlePath, 'utf8');
        if (!gradleContent.includes(fontGradleLine)) {
          gradleContent = `${gradleContent.trim()}\n\n${fontGradleLine}\n`;
          await fs.writeFile(buildGradlePath, gradleContent, 'utf8');
          console.log(chalk.green('➕ Added fonts.gradle line to android/app/build.gradle'));
        }
      }
    }

    // Setup git repository
    console.log(chalk.cyan('📋 Setting up git repository...'));
    try {
      const gitPath = path.join(appPath, '.git');
      const hasGit = await fs.pathExists(gitPath);
      
      if (!hasGit) {
        await execa('git', ['init'], { cwd: appPath, stdio: 'pipe' });
      }
      
      if (isExpo) {
        await execa('git', ['reset', '--hard'], { cwd: appPath, stdio: 'pipe' });
        await execa('git', ['update-ref', '-d', 'HEAD'], { cwd: appPath, stdio: 'pipe' });
      }
      
      await execa('git', ['add', '.'], { cwd: appPath, stdio: 'pipe' });
      
      const commitMessage = `🎆 Initial commit: ${appName}\n\n🚀 Generated and configured with rn-starter\n✨ Platform: ${isExpo ? 'Expo' : 'React Native CLI'}\n✨ Includes: Navigation, Redux, UI components, build scripts, and more!\n\n📎 Template: @kaushalstc/rn-starter\n🔗 Repository: https://github.com/kaushalSTC/rn-starter\n\n💡 Use 'npx @kaushalstc/rn-starter' for latest version`;
      
      await execa('git', ['commit', '-m', commitMessage], { cwd: appPath, stdio: 'pipe' });
      console.log(chalk.green('✅ Git repository configured with custom initial commit'));
    } catch (error) {
      console.log(chalk.yellow('⚠️  Git configuration failed (this is optional):'), error.message);
    }

    // Clean up template files
    console.log(chalk.cyan('🧹 Cleaning up template files...'));
    const packageJsonTemplatePath = path.join(appPath, 'package.json.template');
    if (await fs.pathExists(packageJsonTemplatePath)) {
      await fs.remove(packageJsonTemplatePath);
    }

    console.log(chalk.green(`\n✅ Project '${appName}' is ready! 🚀`));
    console.log(chalk.cyan(`Platform: ${isExpo ? 'Expo' : 'React Native CLI'}`));

    // Change to project directory
    process.chdir(appPath);
    console.log(chalk.cyan(`\n📁 Changed to project directory: ${appName}`));

    // Provide platform-specific instructions
    if (isExpo) {
      console.log(chalk.yellow(`\n🚀 Next steps:`));
      console.log(chalk.yellow(`1. To start development server: npm start`));
      console.log(chalk.yellow(`2. To run on iOS: npm run ios`));
      console.log(chalk.yellow(`3. To run on Android: npm run android`));
      console.log(chalk.yellow(`4. To run on Web: npm run web`));
    } else {
      console.log(chalk.yellow(`\n🚀 Next steps:`));
      console.log(chalk.yellow(`1. To run on iOS: npx react-native run-ios`));
      console.log(chalk.yellow(`2. To run on Android: npx react-native run-android`));
      console.log(chalk.yellow(`3. To start Metro bundler: npm start`));
      
      if (os.platform() === 'darwin') {
        console.log(chalk.yellow('\n🍎 Detected macOS - iOS development available'));
        console.log(chalk.cyan('📱 Don\'t forget to run: npx pod-install'));
      }
    }

  } catch (err) {
    console.error(chalk.red('❌ An error occurred:'), err);
    process.exit(1);
  }
}

run();
