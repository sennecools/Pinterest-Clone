# Getting Started with the back-end

## Prerequisites

### Node.js and npm

You will need to install Node.js and node package manager (npm) to run the application.
You can download Node.js from <https://nodejs.org/en/download/>.
Make sure to download the LTS version.

### VSCode

Throughout the lessons we'll use VSCode for the exercises. Make sure you have the following extensions downloaded and enabled:

-   Prettier - Code formatter
-   Auto Rename Tag
-   GitLens - Git supercharged

Open the settings of VSCode, search for **Format on save** and make sure it's checked. This assures that every time you save a file, it's being formatted according to the code style rules described in **.prettier.rc**.

Replace the values with your local configuration.

## Starting the application

Run the following commands in a terminal (**cd in the `back-end` folder!!**), to get the application up and running.

First, install all required node dependencies using npm (node package manager):

```console
> npm install
```

Then, to start the backend server execute:

```console
> npm start
```

## Testing

Open your browser and navigate to <http://localhost:3000/status>.

A message saying "Back-end is running..." should appear.

If this is the case, you have succesfully completed the installation process.
