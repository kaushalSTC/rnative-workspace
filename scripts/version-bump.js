#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PACKAGES_DIR = path.join(__dirname, '..', 'packages');
const VALID_BUMPS = ['patch', 'minor', 'major'];

function getPackages() {
  return fs.readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => {
      const packageJsonPath = path.join(PACKAGES_DIR, name, 'package.json');
      return fs.existsSync(packageJsonPath);
    });
}

function getPackageInfo(packageName) {
  const packageJsonPath = path.join(PACKAGES_DIR, packageName, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return {
    name: packageJson.name,
    version: packageJson.version,
    path: packageJsonPath
  };
}

function bumpVersion(currentVersion, bumpType) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  switch (bumpType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Invalid bump type: ${bumpType}`);
  }
}

function updatePackageVersion(packagePath, newVersion) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
}

function hasUncommittedChanges(packageDir) {
  try {
    const result = execSync(`git diff --name-only packages/${packageDir}`, { encoding: 'utf8' });
    return result.trim().length > 0;
  } catch (error) {
    return false;
  }
}

function showHelp() {
  console.log(`
📦 Package Version Bump Tool

Usage:
  node scripts/version-bump.js [package-name] [bump-type]
  node scripts/version-bump.js --list
  node scripts/version-bump.js --help

Arguments:
  package-name    Name of the package to bump (without @kaushalstc/ prefix)
                 Or use "all" to bump all packages
  bump-type       Type of version bump: patch | minor | major

Options:
  --list         Show all available packages
  --help         Show this help message

Examples:
  node scripts/version-bump.js expo-starter patch
  node scripts/version-bump.js shared-ui minor  
  node scripts/version-bump.js all patch
  node scripts/version-bump.js --list

Package Status Legend:
  ✅ Clean - No uncommitted changes
  📝 Modified - Has uncommitted changes
  📦 Ready to bump
`);
}

function listPackages() {
  console.log('📦 Available Packages:\n');
  
  const packages = getPackages();
  packages.forEach(packageName => {
    const info = getPackageInfo(packageName);
    const hasChanges = hasUncommittedChanges(packageName);
    const status = hasChanges ? '📝' : '✅';
    
    console.log(`${status} ${packageName}`);
    console.log(`   Name: ${info.name}`);
    console.log(`   Version: ${info.version}`);
    console.log(`   Status: ${hasChanges ? 'Modified' : 'Clean'}`);
    console.log();
  });
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  if (args.includes('--list') || args.includes('-l')) {
    listPackages();
    return;
  }
  
  if (args.length !== 2) {
    console.error('❌ Error: Please provide package name and bump type');
    console.log('   Run with --help for usage information');
    process.exit(1);
  }
  
  const [packageArg, bumpType] = args;
  
  if (!VALID_BUMPS.includes(bumpType)) {
    console.error(`❌ Error: Invalid bump type "${bumpType}"`);
    console.log(`   Valid options: ${VALID_BUMPS.join(', ')}`);
    process.exit(1);
  }
  
  const packages = getPackages();
  const targetPackages = packageArg === 'all' ? packages : [packageArg];
  
  // Validate package names
  const invalidPackages = targetPackages.filter(pkg => !packages.includes(pkg));
  if (invalidPackages.length > 0) {
    console.error(`❌ Error: Invalid package name(s): ${invalidPackages.join(', ')}`);
    console.log(`   Available packages: ${packages.join(', ')}`);
    console.log('   Run with --list to see all packages');
    process.exit(1);
  }
  
  console.log(`🚀 Bumping ${targetPackages.length} package(s) with ${bumpType} version...\n`);
  
  targetPackages.forEach(packageName => {
    const info = getPackageInfo(packageName);
    const newVersion = bumpVersion(info.version, bumpType);
    const hasChanges = hasUncommittedChanges(packageName);
    
    console.log(`📦 ${packageName}`);
    console.log(`   ${info.name}: ${info.version} → ${newVersion}`);
    console.log(`   Status: ${hasChanges ? '📝 Modified' : '✅ Clean'}`);
    
    updatePackageVersion(info.path, newVersion);
    console.log(`   ✅ Version updated`);
    console.log();
  });
  
  console.log(`🎉 Successfully bumped ${targetPackages.length} package(s)!`);
  console.log('\n💡 Next steps:');
  console.log('   1. Review the changes: git diff packages/*/package.json');
  console.log('   2. Commit your changes: git add . && git commit -m "bump: version updates"');
  console.log('   3. Push to trigger auto-publish: git push');
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  console.error('❌ Unexpected error:', error.message);
  process.exit(1);
});

if (require.main === module) {
  main();
}
