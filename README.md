# algoRythm# algoRythm - Virtual Compiler for Multiple Programming Languages

## Introduction

The Virtual Compiler is a powerful tool that allows users to compile and execute code written in various programming languages such as C, C++, Java, C#, Python, and JavaScript. It offers a user-friendly frontend built with React and Tailwind CSS, and a robust backend API developed with Node.js, Express, child_process, and tmp. Additionally, the application is containerized using Docker, making it easy to deploy and manage.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Supported Languages](#supported-languages)
- [Frontend](#frontend)
- [Backend](#backend)
- [Dockerization](#dockerization)

## Installation

To run the Virtual Compiler locally, follow these steps:

1. Clone the GitHub repository to your local machine.

```
git clone https://github.com/manishMadan2882/algoRythm.git
```

2. Install frontend and backend dependencies.

```
cd frontend
npm install

cd ../backend
npm install
```

## Usage

To start the Virtual Compiler, you need to run both the frontend and backend servers. Follow these steps:

1. Start the frontend server:

```
cd frontend
npm run dev
```

2. Start the backend server:

```
cd backend
npm start
```

Once both servers are running, you can access the Virtual Compiler by opening your browser and navigating to `http://localhost:3000`.

## Supported Languages

The Virtual Compiler supports the following programming languages:

- C
- C++
- Java
- C#
- Python
- JavaScript

Users can select the desired programming language from the frontend interface and write their code accordingly.

## Frontend

The frontend of the Virtual Compiler is built using React, a popular JavaScript library for building user interfaces, and Tailwind CSS, a utility-first CSS framework. The frontend provides an intuitive user interface where users can write code, select the programming language, and trigger the compilation process.

Key features of the frontend:

- Code editor with syntax highlighting and auto-completion.
- Dropdown menu to select the programming language.
- Compile and execute buttons to trigger the backend API.
- Output panel to display the results of code compilation and execution.

## Backend

The backend of the Virtual Compiler is a Node.js application using Express as the web framework. It handles user requests from the frontend, processes the code compilation and execution, and sends back the results.

The backend uses the `child_process` module to spawn a child process for each compilation, ensuring a secure and isolated environment for code execution.

Additionally, the `tmp` module is utilized to create temporary files to store the user's code before compilation.

## Dockerization

The Virtual Compiler application is containerized using Docker, allowing for easy deployment and portability across different environments.

The Docker image includes all the necessary dependencies and configurations to run the frontend, backend, and required services seamlessly.

To build and run the Docker container, follow these steps:

1. Build the Docker image:

```
docker build -t virtual-compiler .
```

2. Run the Docker container:

```
docker run -p 5000:5000 virtual-compiler
```

The Virtual Compiler API will now be live on `http://localhost:5000`.
