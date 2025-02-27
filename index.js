#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const degit = require('degit');
const { execSync } = require('child_process');
const path = require('path');

program
  .command('new <projectName>')
  .description('Create a new project from the boilerplate')
  .action(async (projectName) => {
    try {
      // 1. Clone the boilerplate repository.
      // Replace 'your-username/your-repo' with your actual repository path.
        const emitter = degit('mamqek/Laravel-Vue-template#master', {
        cache: false,
        force: true,
        });
        console.log('Cloning repository...');
        await emitter.clone(projectName);
        console.log('Repository cloned into:', projectName);

      // 2. Ask if the user wants to add Tailwind CSS.
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'useTailwind',
          message: 'Would you like to include Tailwind CSS?',
          default: false,
        },
      ]);

      // 3. If yes, install Tailwind CSS and generate its configuration.
      if (answers.useTailwind) {
        console.log('Installing Tailwind CSS...');
        // Change directory to the new project folder and install Tailwind along with its peer dependencies.
        execSync(
          'npm install tailwindcss postcss autoprefixer',
          { cwd: path.resolve(process.cwd(), projectName), stdio: 'inherit' }
        );

        console.log('Generating Tailwind config file...');
        execSync(
          'npx tailwindcss init',
          { cwd: path.resolve(process.cwd(), projectName), stdio: 'inherit' }
        );
        console.log('Tailwind CSS has been installed and configured.');
      }

      // Future steps: Insert additional prompts and configuration for other add-ons here.
      console.log('Project setup is complete.');
    } catch (error) {
      console.error('Error:', error);
    }
  });

program.parse(process.argv);
