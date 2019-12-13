---
title: "Introducing TypeScripter v1.1.2"
date: "2016-11-29"
path: "/blog/introducing-typescripter-1-1-2"
author: "Andrew Hancey"
avatar: "./images/andrew.png"
---

Today I’m excited to announce the latest version of our TypeScripter command line tool. As we at Centeva Labs have developed our products, we have found that TypeScripter has a very crucial role to play in the process.

If you’re not familiar with [TypeScripter](https://github.com/Centeva/TypeScripter), it’s a command line tool used to scan or parse .NET WebAPI endpoints, and generate strongly-typed TypeScript classes for use in our Angular2 stack. Before it’s existince, one of the biggest pain points with Angular2 and TypeScript has been keeping front-end models in sync with the C# back-end classes. TypeScripter makes this as painless as ever, and I’ll be showing you how to install and configure TypeScripter in your WebAPI project.

Before we dive in, I’d like to give a little background into the organization of our solutions:

```
projectRoot
|- project.Client
| |- app
| | |- components
| | | |- views
| | |- models
| | | |- generated
| | app.main.ts
| Controllers
| | |- MainController.cs
| index.html
|- project.Data
```

We’ve chosen to separate each section of a given solution into separate projects, allowing separate dependencies if necessary, as well as a way to separate their functionity. This allows us to install a tool, such as TypeScripter, via NuGet to only the projects that need it.

The first step we’ll need to take is install TypeScripter from nuget.org as a dependency for the Client project. This can be done via either the command line, if you’re familiar, or in Visual Studio.

Next, now that TypeScripter is installed, we can configure it as a Post-Build event for the Client project. Right-click on the project in Visual Studio and select Properties. Then, on the left-hand side of the main window, you will see Build Events. This is where we can tell Visual Studio, or devenv/msbuild, to perform an action after this project successfully builds or compiles. We’ll use the following syntax:

```
$(ProjectDir)bin\TypeScripter.exe $(TargetDir) $(ProjectDir)app\models\generated
```

This tells MSBuild, “in this project’s directory \ bin folder, execute TypeScripter.exe with the target director and the project’s directory \ app \ models \ generated as arguments”. We’re essentially telling TypeScripter where to find the endpoints to parse and where to put the models it generates.

Once you build your solution, scan the output log. There, you’ll see how many models TypeScripter made for you. You should see something similar to:

```
Scanning for DTO objects in C:\Files\ProjectRoot\project.Client\bin\… Found 42
```

TypeScripter just saved you a bunch of time reconstructing models for the front end that you’ve already made for the back end.

Last, we’re going to look at the models TypeScripter made for us. A typical model may look like the following:

```
export class RoleType {
 public Description: string;
 public Enabled: boolean;
 public Id: number;
 public Name: string;

 public constructor(
  fields?: {
  Description?: string,
  Enabled?: boolean,
  Id?: number,
  Name?: string
  }) {
   if (fields) {
     Object.assign(this, fields);
   }
 }
}
```

Notice that TypeScripter made the class and it’s public properties for us. It also made a constructor that accepts an object where all keys in the object are optional. Each property is strongly-typed, just as we like for TypeScript, as well as use only the properties that we need for each instance of the class.

## Going Forward

We have big plans for TypeScripter. This tool useful for us and our process, and as much as we have integrated it into our projects, we’ve found some of the configuration to be slightly painful. We’re hoping to improve that portion of the tool sometime in the near future. Until then, stay tuned for more updates!
