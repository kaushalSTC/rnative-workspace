#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execa } = require('execa');
const chalk = require('chalk');
const os = require('os');

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

async function run() {
  const appName = process.argv[2];
  const packageName = process.argv[3]; // optional

  if (!appName) {
    console.error(chalk.red('❌ Please provide an app name.\nUsage: cli-starter AppName [com.organization.appname]'));
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

  // CRITICAL WARNING: Package name validation and warning BEFORE initialization
  let finalPackageName = packageName;
  if (packageName) {
    // Validate package name
    if (!validatePackageName(packageName)) {
      console.error(chalk.red('❌ Invalid package name!'));
      console.error(chalk.yellow('Package name must:'));
      console.error(chalk.yellow('  - Use reverse domain notation'));
      console.error(chalk.yellow('  - Contain only lowercase letters and dots'));
      console.error(chalk.yellow('  - Have at least 2 segments'));
      console.error(chalk.gray('  Examples: com.company.appname, org.mycompany.myapp'));
      process.exit(1);
    }

    // Warn about 2-segment package names and iOS issues BEFORE initialization
    if (isTwoSegmentPackage(packageName)) {
      console.log(chalk.red('\n⚠️  CRITICAL WARNING: Two-segment package name detected!'));
      console.log(chalk.yellow('Package name "' + packageName + '" may cause SERIOUS issues with iOS development and deployment.'));
      console.log(chalk.yellow('Apple STRONGLY recommends using at least 3 segments (e.g., com.company.appname).'));
      console.log(chalk.red('\n❌ Issues you WILL encounter:'));
      console.log(chalk.red('  - App Store submission REJECTIONS'));
      console.log(chalk.red('  - TestFlight distribution failures'));
      console.log(chalk.red('  - Xcode signing complications'));
      console.log(chalk.red('  - Deep linking configuration problems'));
      
      console.log(chalk.cyan('\n🔧 IMPORTANT: After React Native CLI initialization, changing the package name'));
      console.log(chalk.cyan('requires manual modification of native Android/iOS files, which is time-consuming.'));
      
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const askQuestion = (question) => {
        return new Promise((resolve) => {
          rl.question(question, (answer) => {
            resolve(answer.trim());
          });
        });
      };
      
      const updatePackage = await askQuestion(chalk.cyan('\nDo you want to update your package name NOW to avoid iOS issues? (Y/n): '));
      
      if (updatePackage.toLowerCase() !== 'n' && updatePackage.toLowerCase() !== 'no') {
        let newPackageName;
        do {
          const segments = packageName.split('.');
          const suggestedName = `${segments[0]}.company.${segments[1]}`;
          newPackageName = await askQuestion(chalk.cyan(`Enter a new package name (suggestion: ${suggestedName}): `));
          
          if (newPackageName && !validatePackageName(newPackageName)) {
            console.error(chalk.red('❌ Invalid package name format!'));
            console.error(chalk.yellow('Please use reverse domain notation (e.g., com.company.appname)'));
            newPackageName = null;
          } else if (newPackageName && isTwoSegmentPackage(newPackageName)) {
            console.error(chalk.yellow('⚠️  Still a 2-segment package name. Consider using 3+ segments.'));
            const keepAnyway = await askQuestion(chalk.cyan('Use this package name anyway? (y/N): '));
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

  const cwd = process.cwd(); // Current working directory where command is run
  const appPath = path.join(cwd, appName);
  const templateDir = path.resolve(__dirname, '../overrides');

  try {
    // Step 1: Initialize React Native app
    console.log(chalk.cyan(`🚀 Initializing React Native app '${appName}'...`));

    const initArgs = ['@react-native-community/cli', 'init', appName];
    if (packageName) {
      initArgs.push('--package-name', packageName);
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

    // Step 3: Copy files from overrides/
    await fs.copy(templateDir, appPath, { overwrite: true, recursive: true });

    // Step 3.5: Merge package.json scripts
    console.log(chalk.cyan('📝 Adding comprehensive npm scripts...'));
    const packageJsonPath = path.join(appPath, 'package.json');
    const scriptsTemplatePath = path.join(templateDir, 'package.json.template');
    
    if (await fs.pathExists(packageJsonPath) && await fs.pathExists(scriptsTemplatePath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      const scriptsTemplate = await fs.readJson(scriptsTemplatePath);
      
      // Replace {{APP_NAME}} placeholder with actual app name
      let scriptsTemplateStr = JSON.stringify(scriptsTemplate);
      scriptsTemplateStr = scriptsTemplateStr.replace(/{{APP_NAME}}/g, appName);
      const processedScriptsTemplate = JSON.parse(scriptsTemplateStr);
      
      // Merge scripts, keeping existing ones and adding new ones
      packageJson.scripts = { ...packageJson.scripts, ...processedScriptsTemplate.scripts };
      
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
      console.log(chalk.green('✅ Added comprehensive npm scripts to package.json'));
    }

    // Step 4: Install dependency groups
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

    // Step 5: Append fonts.gradle line
    const buildGradlePath = path.join(appPath, 'android', 'app', 'build.gradle');
    const fontGradleLine = 'apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")';

    if (await fs.pathExists(buildGradlePath)) {
      let gradleContent = await fs.readFile(buildGradlePath, 'utf8');
      if (!gradleContent.includes(fontGradleLine)) {
        gradleContent = `${gradleContent.trim()}\n\n${fontGradleLine}\n`;
        await fs.writeFile(buildGradlePath, gradleContent, 'utf8');
        console.log(chalk.green('➕ Added fonts.gradle line to android/app/build.gradle'));
      } else {
        console.log(chalk.gray('✔ fonts.gradle line already present'));
      }
    } else {
      console.warn(chalk.red('⚠ android/app/build.gradle not found — skipping modification'));
    }

    // Step 6: Configure deep linking (CLI requires direct native file modification)
    console.log(chalk.cyan('🔗 Setting up deep linking configuration...'));
    
    // Create readline interface for deep linking configuration
    const readline = require('readline');
    const deepLinkRl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const askDeepLinkQuestion = (question) => {
      return new Promise((resolve) => {
        deepLinkRl.question(question, (answer) => {
          resolve(answer.trim());
        });
      });
    };
    
    // Helper function to ask yes/no questions with validation and retry
    const askYesNoQuestion = async (question, allowEmpty = true) => {
      let response;
      do {
        response = await askDeepLinkQuestion(question);
        
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
    
    const configureAppScheme = await askYesNoQuestion(chalk.cyan('📱 Do you want to configure a custom app scheme for deep linking? (y/N): '));
    let appScheme = null;
    let universalLinkDomain = null;
    
    if (configureAppScheme === 'y' || configureAppScheme === 'yes') {
      // Validate app scheme with retry logic
      do {
        appScheme = await askDeepLinkQuestion(chalk.cyan(`🔤 Enter your app scheme (e.g., "${appName.toLowerCase()}", "myapp"): `));
        
        // If empty, allow user to skip
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
          console.error(chalk.cyan('Press Enter to skip or try again:'));
          appScheme = null; // Reset to retry
        }
      } while (appScheme !== null && !validateAppScheme(appScheme));
      
      if (appScheme) {
        const configureUniversalLinks = await askYesNoQuestion(chalk.cyan('🌐 Do you want to configure universal links? (y/N): '));
        
        if (configureUniversalLinks === 'y' || configureUniversalLinks === 'yes') {
          // Validate domain with retry logic
          do {
            universalLinkDomain = await askDeepLinkQuestion(chalk.cyan(`🔗 Enter your domain for universal links (e.g., "${appName.toLowerCase()}.com", "myapp.com"): `));
            
            // If empty, allow user to skip
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
              console.error(chalk.cyan('Press Enter to skip or try again:'));
              universalLinkDomain = null; // Reset to retry
            }
          } while (universalLinkDomain !== null && !validateDomain(universalLinkDomain));
        }
        
        console.log(chalk.cyan('⚙️  Configuring deep linking in native files...'));
        
        // Configure Android deep linking - modify AndroidManifest.xml
        const androidManifestPath = path.join(appPath, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
        if (await fs.pathExists(androidManifestPath)) {
          try {
            let manifestContent = await fs.readFile(androidManifestPath, 'utf8');
            
            // Find the main activity
            const activityRegex = /(<activity[\s\S]*?android:name="\.MainActivity"[\s\S]*?>)([\s\S]*?)(<\/activity>)/;
            const match = manifestContent.match(activityRegex);
            
            if (match) {
              let activityContent = match[2];
              
              // Build intent filters
              let intentFilters = '';
              
              // Add universal link intent filter if domain provided
              if (universalLinkDomain) {
                intentFilters += `\n        <intent-filter android:autoVerify="true">
            <action android:name="android.intent.action.VIEW" />
            <category android:name="android.intent.category.DEFAULT" />
            <category android:name="android.intent.category.BROWSABLE" />
            <data android:scheme="https" android:host="${universalLinkDomain}" />
        </intent-filter>`;
              }
              
              // Add custom scheme intent filter
              intentFilters += `\n        <intent-filter>
            <action android:name="android.intent.action.VIEW" />
            <category android:name="android.intent.category.DEFAULT" />
            <category android:name="android.intent.category.BROWSABLE" />
            <data android:scheme="${appScheme}" />
        </intent-filter>`;
              
              // Check if intent filters already exist to avoid duplicates
              if (!activityContent.includes(`android:scheme="${appScheme}"`)) {
                activityContent += intentFilters;
                
                // Replace the activity content in the manifest
                manifestContent = manifestContent.replace(match[0], match[1] + activityContent + match[3]);
                
                await fs.writeFile(androidManifestPath, manifestContent, 'utf8');
                console.log(chalk.green('✅ Android deep linking configured in AndroidManifest.xml'));
              } else {
                console.log(chalk.gray('✔ Android deep linking already configured'));
              }
            } else {
              console.log(chalk.yellow('⚠️  Could not find MainActivity in AndroidManifest.xml'));
            }
          } catch (error) {
            console.log(chalk.red('❌ Failed to configure Android deep linking:'), error.message);
          }
        } else {
          console.log(chalk.red('⚠ AndroidManifest.xml not found — skipping Android configuration'));
        }
        
        // Configure iOS deep linking - modify Info.plist
        const iosPlistPath = path.join(appPath, 'ios', appName, 'Info.plist');
        if (await fs.pathExists(iosPlistPath)) {
          try {
            let plistContent = await fs.readFile(iosPlistPath, 'utf8');
            
            // Add URL scheme configuration
            const urlSchemesConfig = `	<key>CFBundleURLTypes</key>
	<array>
		<dict>
			<key>CFBundleURLName</key>
			<string>${finalPackageName || appName.toLowerCase()}</string>
			<key>CFBundleURLSchemes</key>
			<array>
				<string>${appScheme}</string>
			</array>
		</dict>
	</array>`;
            
            // Check if URL schemes already exist
            if (!plistContent.includes('CFBundleURLTypes')) {
              // Insert before closing </dict></plist>
              const insertionPoint = plistContent.lastIndexOf('</dict>\n</plist>');
              if (insertionPoint !== -1) {
                plistContent = plistContent.slice(0, insertionPoint) + urlSchemesConfig + '\n' + plistContent.slice(insertionPoint);
                
                // Add associated domains for universal links if configured
                if (universalLinkDomain) {
                  const associatedDomainsConfig = `	<key>com.apple.developer.associated-domains</key>
	<array>
		<string>applinks:${universalLinkDomain}</string>
	</array>\n`;
                  
                  plistContent = plistContent.slice(0, insertionPoint) + associatedDomainsConfig + plistContent.slice(insertionPoint);
                }
                
                await fs.writeFile(iosPlistPath, plistContent, 'utf8');
                console.log(chalk.green('✅ iOS deep linking configured in Info.plist'));
              } else {
                console.log(chalk.yellow('⚠️  Could not find insertion point in Info.plist'));
              }
            } else {
              console.log(chalk.gray('✔ iOS URL schemes already configured'));
            }
            
            // Configure iOS associated domains entitlement for universal links
            if (universalLinkDomain) {
              const entitlementsPath = path.join(appPath, 'ios', appName, `${appName}.entitlements`);
              
              // Create or update entitlements file
              const entitlementsContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>com.apple.developer.associated-domains</key>
	<array>
		<string>applinks:${universalLinkDomain}</string>
	</array>
</dict>
</plist>`;
              
              await fs.writeFile(entitlementsPath, entitlementsContent, 'utf8');
              console.log(chalk.green('✅ iOS entitlements file created for universal links'));
              
              // Note: The user will need to add the entitlements file to Xcode project manually
              console.log(chalk.yellow('📝 Note: You need to add the .entitlements file to your Xcode project manually:'));
              console.log(chalk.gray(`   1. Open ${appName}.xcworkspace in Xcode`));
              console.log(chalk.gray(`   2. Right-click your project and select "Add Files to ${appName}"`));
              console.log(chalk.gray(`   3. Select ${appName}.entitlements from ios/${appName}/ folder`));
              console.log(chalk.gray(`   4. In Build Settings, set "Code Signing Entitlements" to ${appName}/${appName}.entitlements`));
            }
          } catch (error) {
            console.log(chalk.red('❌ Failed to configure iOS deep linking:'), error.message);
          }
        } else {
          console.log(chalk.red('⚠ Info.plist not found — skipping iOS configuration'));
        }
        
        console.log(chalk.green('✅ Deep linking configuration completed!'));
        if (appScheme) {
          console.log(chalk.gray(`   📱 App scheme: ${appScheme}://`));
        }
        if (universalLinkDomain) {
          console.log(chalk.gray(`   🌐 Universal links: https://${universalLinkDomain}`));
          console.log(chalk.yellow('   📝 Remember to upload apple-app-site-association file to your domain'));
        }
      }
    }
    
    // Close deep linking readline interface
    deepLinkRl.close();
    
    // Step 7: Configure git repository with custom initial commit
    console.log(chalk.cyan('📋 Setting up git repository...'));
    
    try {
      // Check if git is already initialized
      const gitPath = path.join(appPath, '.git');
      const hasGit = await fs.pathExists(gitPath);
      
      if (!hasGit) {
        // Initialize git repository
        await execa('git', ['init'], { cwd: appPath, stdio: 'pipe' });
      }
      
      // Add all files to git
      await execa('git', ['add', '.'], { cwd: appPath, stdio: 'pipe' });
      
      // Create initial commit with our custom message
      const commitConfigDetails = [];
      if (finalPackageName) {
        commitConfigDetails.push(`📦 Package: ${finalPackageName}`);
      }
      if (appScheme) {
        commitConfigDetails.push(`🔗 App Scheme: ${appScheme}://`);
      }
      if (universalLinkDomain) {
        commitConfigDetails.push(`🌐 Universal Links: https://${universalLinkDomain}`);
      }
      
      const configSection = commitConfigDetails.length > 0 
        ? `\n\n⚙️ Configuration:\n${commitConfigDetails.join('\n')}`
        : '';
      
      const commitMessage = `🎆 Initial commit: ${appName}

🚀 Generated and configured with cli-starter
✨ Includes: Navigation, Redux, UI components, build scripts, and more!
${configSection}

📎 Template: @kaushalstc/cli-starter
🔗 Repository: https://github.com/kaushalSTC/cli-starter

💡 Use 'npx @kaushalstc/cli-starter' for latest version`;
      
      await execa('git', ['commit', '-m', commitMessage], { cwd: appPath, stdio: 'pipe' });
      
      console.log(chalk.green('✅ Git repository configured with custom initial commit'));
    } catch (error) {
      console.log(chalk.yellow('⚠️  Git configuration failed (this is optional):'), error.message);
      console.log(chalk.gray('   You can manually configure git later'));
    }
    
    // Step 8: Clean up template files
    console.log(chalk.cyan('🧹 Cleaning up template files...'));
    const packageJsonTemplatePath = path.join(appPath, 'package.json.template');
    if (await fs.pathExists(packageJsonTemplatePath)) {
      await fs.remove(packageJsonTemplatePath);
      console.log(chalk.gray('   ✓ Removed package.json.template'));
    }

    console.log(chalk.green(`\n✅ Project '${appName}' is ready! 🚀`));

    // Change to project directory
    process.chdir(appPath);
    console.log(chalk.cyan(`\n📁 Changed to project directory: ${appName}`));
    
    const dirContents = await fs.readdir(appPath);
    console.log(chalk.cyan('Project contents:'));
    dirContents.forEach(item => console.log('  -', item));

    // Prompt for CocoaPods installation on macOS with proper validation
    if (os.platform() === 'darwin') {
      console.log(chalk.yellow('\n🍎 Detected macOS - iOS development available'));
      
      // Create readline interface for CocoaPods question
      const readline = require('readline');
      const podRl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const askPodQuestion = (question) => {
        return new Promise((resolve) => {
          podRl.question(question, (answer) => {
            resolve(answer.trim());
          });
        });
      };
      
      // Helper function for yes/no validation with retry
      const askPodYesNoQuestion = async (question) => {
        let response;
        do {
          response = await askPodQuestion(question);
          
          // If empty response, treat as 'no' (default)
          if (!response) {
            podRl.close();
            return false;
          }
          
          // Check if response is valid
          const validResponses = ['y', 'yes', 'n', 'no'];
          if (validResponses.includes(response.toLowerCase())) {
            podRl.close();
            return response.toLowerCase() === 'y' || response.toLowerCase() === 'yes';
          }
          
          // Invalid response, ask again
          console.error(chalk.red('❌ Invalid response. Please answer with: y/yes/n/no'));
          console.error(chalk.gray('Press Enter for default (N)'));
        } while (true);
      };
      
      const installPods = await askPodYesNoQuestion(chalk.cyan('📱 Install CocoaPods dependencies now? (y/N): '));
      
      if (installPods) {
        try {
          console.log(chalk.cyan('\n📦 Installing CocoaPods dependencies...'));
          await execa('npx', ['pod-install'], { cwd: appPath, stdio: 'inherit' });
          console.log(chalk.green('✅ CocoaPods installation completed!'));
        } catch (error) {
          console.log(chalk.red('❌ CocoaPods installation failed. You can run it manually later:'));
          console.log(chalk.yellow('npx pod-install'));
        }
      }
    }

    // Provide user instructions
    console.log(chalk.yellow(`\n🚀 Next steps:`));
    console.log(chalk.yellow(`1. To run on iOS: npx react-native run-ios`));
    console.log(chalk.yellow(`2. To run on Android: npx react-native run-android`));
    console.log(chalk.yellow(`3. To start Metro bundler: npm start`));
    
    console.log(chalk.cyan(`\n🏢 Available NPM Scripts:`));
    console.log(chalk.gray(`• Development: npm start, npm run android, npm run ios`));
    console.log(chalk.gray(`• Building: npm run build:android, npm run build:ios`));
    console.log(chalk.gray(`• Cleaning: npm run clean, npm run clean:android, npm run clean:ios`));
    console.log(chalk.gray(`• Debugging: npm run flipper, npm run log:android, npm run log:ios`));
    
    console.log(chalk.cyan(`\n📋 Troubleshooting Common Issues:`));
    
    console.log(chalk.yellow('🔧 Dependency Installation Issues:'));
    console.log(chalk.gray('• If packages are missing or corrupted, run: rm -rf node_modules package-lock.json && npm install'));
    console.log(chalk.gray('• For npm permission errors, try: npm cache clean --force'));
    console.log(chalk.gray('• Vector icons not showing: Ensure you ran npx react-native link react-native-vector-icons'));
    
    console.log(chalk.yellow('\n🍎 iOS/CocoaPods Issues:'));
    console.log(chalk.gray('• RNWorklets dependency errors: This template uses compatible versions automatically'));
    console.log(chalk.gray('• Pod install fails: cd ios && pod install --repo-update'));
    console.log(chalk.gray('• Clean iOS build: cd ios && rm -rf Pods Podfile.lock && pod install'));
    console.log(chalk.gray('• Xcode build failures: Clean build folder (Cmd+Shift+K) and rebuild'));
    if (os.platform() !== 'darwin') {
      console.log(chalk.gray('• Note: CocoaPods requires macOS. Run: npx pod-install (on macOS only)'));
    }
    
    console.log(chalk.yellow('\n🤖 Android Issues:'));
    console.log(chalk.gray('• Gradle build fails: cd android && ./gradlew clean'));
    console.log(chalk.gray('• Metro bundler issues: npx react-native start --reset-cache'));
    console.log(chalk.gray('• Vector icons not showing: Check that fonts.gradle is applied in build.gradle'));
    console.log(chalk.gray('• ADB device not found: Enable USB debugging and check adb devices'));
    
    console.log(chalk.yellow('\n📦 Metro/Bundler Issues:'));
    console.log(chalk.gray('• Clear Metro cache: npx react-native start --reset-cache'));
    console.log(chalk.gray('• Port 8081 in use: npx react-native start --port=8082'));
    console.log(chalk.gray('• Transform errors: rm -rf node_modules && npm install'));
    console.log(chalk.gray('• TypeScript errors: Ensure tsconfig.json has "jsx": "react-jsx"'));
    
    console.log(chalk.yellow('\n🔗 Deep Linking Issues (if configured):'));
    if (appScheme) {
      console.log(chalk.gray(`• Test custom scheme: ${appScheme}://test`));
    } else {
      console.log(chalk.gray('• Test custom scheme: your-app-scheme://test'));
    }
    console.log(chalk.gray('• Android: Check AndroidManifest.xml intent filters are correctly formatted'));
    console.log(chalk.gray('• iOS: Verify Info.plist CFBundleURLTypes configuration'));
    console.log(chalk.gray('• Universal links: Ensure apple-app-site-association file is uploaded to your domain'));
    
    console.log(chalk.yellow('\n🧩 Environment Variables:'));
    console.log(chalk.gray('• Create .env file in project root for environment variables'));
    console.log(chalk.gray('• Access in code: import Config from "react-native-dotenv"'));
    console.log(chalk.gray('• Restart Metro after changing .env: npm start --reset-cache'));
    
    console.log(chalk.cyan('\n💬 Need Help? Visit: https://github.com/kaushalSTC/react-native-starter/issues'));
    console.log(chalk.gray('For React Native specific issues: https://reactnative.dev/docs/troubleshooting'));
  } catch (err) {
    console.error(chalk.red('❌ An error occurred:'), err);
    process.exit(1);
  }
}

run();
