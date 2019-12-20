# Objective for this Tutorial

The objective of this exercise is to generate a static blog web site using Gatsby that can be hosted on Netlify.

The blogs will be stored on disk as markdown files that will be discovered and converted to static HTML by Gatsby.

Styling will be done using CSS modules.

# Getting started

Install Gatsby CLI tooling

```
npm install -g gatsby-cli
```

Create a new Gatsby site using the `gatsby-cli`. Replace `my-gatsby-site` with the name you want to use for your new site.

```
gatsby new my-gatsby-site
cd my-gatsby-site
```

Start the Gatsby dev tooling that will watch for changes and hot-reload

```
gatsby develop
```

Now browse to http://localhost:8000 to see your awesome new static site in action!

While debugging, `gatsby develop` is great but when you want to build your site for production you should use `gatsby build` (a.k.a `npm run build`). This will build an optimized production-ready deployment in the `public` folder.

```
gatsby build
```

Gatsby provides a handy way to view the production build:

```
gatsby serve
```

You can then navigate to http://localhost:9000 to view the production site locally.

# Hosting Your Static Site

Now that you have a static site generating you need a way to get it deployed for the world to see. One excellent service I've used is Netlify. You can easily configure Netlify to watch for changes to your source code and redeploy when changes are made.

You should now go to https://netlify.com and make create an account or log in if you already have an account. Once logged in, navigate to your _Sites_ page and click the button to create a **New site from Git**. Click the GitHub or Bitbucket button, depending on where you pushed your code. In my case it was Bitbucket. Netlify will help you link to your GitHub/Bitbucket account so that you can select which code to deploy.

Once you've selected your repo, choose which branch to deploy from. The default is `master` but can be changed to whichever branch you want. The build command should be `npm run build` and the publish directory `public`. Once that info is entered Netlify will create a new unique URL for your site and kick off a deploy. In about a minute or two you will be able to navigate to your newly deployed site!

# Get the Blog Content

Get the markdown files for the blog entries and put them in the `src/blog` folder.

If you open any of the markdown files you will see that there is a section at the top of the file which contains some metadata about the document. This is referred to as **frontmatter**. The code you write will use the frontmatter while generating the site.

# Add Gatsby Support for Markdown

Install the `gatsby-transformer-remark` plugin that is used to convert markdown files to HTML. Documentation for this plugin can be found [here](https://www.gatsbyjs.org/packages/gatsby-transformer-remark/).

```
npm i --save gatsby-transformer-remark
```

Add the transformer to the `gatsby-config.js` file. The `gatsby-transformer-remark` plugin doesn't actually find and load new files, it depends on files being sourced by another plugin. In this case we will use the `gatsby-source-filesystem` plugin to load the files then transform them with `gatsby-transformer-remark`.

```js
plugins: [
  ...,
  {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/src/blog`,
      },
    },
  `gatsby-transformer-remark`,
]
```

After altering the root Gatsby configuration you will probably need to restart the `gatsby develop` task in order to apply the changes.

```
gatsby develop
```

# Build a Query for the Blog Content

Once that starts up again, navigate to http://localhost:8000/___graphql to start designing a query to read the articles.

In left panel of the GrahiQL UI you will see all of the data sources that can be queried. Most of the entries follow the convention of having a singular and plural version. For example there is one entry called `sitePage` that will return a single page based on the criteria you enter and `allSitePage` which will return a list of pages based on your criteria.

We are most interested in the `allMarkdownRemark` source right now so click on it to expand it. Notice that when you do that it will show up in the middle panel which is your current query. By default there will be no other data fields selected, which is actually an invalid query.

```
query MyQuery {
  allMarkdownRemark
}
```

If you click the 'Execute Query' button above (Ctrl+Enter is the keyboard shortcut) GraphiQL will automatically try to fill out the query enough to make it valid.

```
query MyQuery {
  allMarkdownRemark {
    edges {
      node {
        id
      }
    }
  }
}
```

If you run that now you should see that there are three result nodes. Now we should fill out the query to include some more useful data. In the left side check the boxes next to the fields `excerpt`, and the `frontmatter` fields `author`, `path`, and `title`.

```
query MyQuery {
  allMarkdownRemark {
    edges {
      node {
        excerpt
        frontmatter {
          author
          path
          title
        }
      }
    }
  }
}
```

This is the query we want to use for the list of blogs on the home page.

# Clean the Slate

Let's get rid of most of the stuff created by the `gatsby new` command so we have a clean slate to work on.

Delete these files:

- 404.js
- page-2.js
- components/header.js
- components/image.js
- components/layout.css
- components/layout.js
- images/gatsby-astronaut.png

Open the `pages/index.js` file and start by trimming this file down to just the `<SEO>` and `<h1>` elements wrapped in a `<div>`.

Remove the imports for the `Layout` component and the `Image`. Leave the import for `Link` because we'll be using that one in a little bit.

```js
import React from "react"
import { Link } from "gatsby"
import SEO from "../components/seo"

const IndexPage = () => {
  return (
    <div>
      <SEO title="Centeva Blog" />
      <h1>Centeva Blog</h1>
    </div>
  )
}

export default IndexPage
```

Sometimes when deleting/renaming files `gatsby develop` gets in a funky state. If this happens to you simply restart it.

# Add the Query to the Index Page

Let's work on the home page now. We want to show a list of blog articles with links to navigate to each article.

The first thing we need to do is add the GraphQL query we built earlier. In order to do this you need to add `graphql` to the `gatsby` import then export the `query` variable.

```js
import React from "react"
import { graphql, Link } from "gatsby"
import SEO from "../components/seo"

const IndexPage = ({ data }) => {
  return (
    <div>
      <SEO title="Centeva Blog" />
      <h1>Centeva Blog</h1>
    </div>
  )
}

export default IndexPage

export const query = graphql`
  {
    allMarkdownRemark {
      edges {
        node {
          excerpt
          frontmatter {
            author
            path
            title
          }
        }
      }
    }
  }
`
```

If you want to see the structure of the resulting data you can add a console log statement before the `return` statement in the `IndexPage` component.

```js
console.log(data)
```

Now when the page reloads you can see the data appear in the browser's console.

# Transform the Data into HTML

Now that we have data, let's convert that data into HTML. Since we have a list of results we need to `map` that list into components.

```js
const IndexPage = ({ data }) => {
  return (
    <div>
      <SEO title="Centeva Blog" />
      <h1>Centeva Blog</h1>

      {data.allMarkdownRemark.edges.map(({ node }) => (
        <div key={node.id}>
          <h2>{node.frontmatter.title}</h2>
          <p>{node.frontmatter.author}</p>
          <p>{node.excerpt}</p>
        </div>
      ))}
    </div>
  )
}
```

Keep in mind that whenever you use the `map` function to create React components you should always include a unique `key` prop on the inner element so that React can keep track of those items.

# Make a Link to Each Blog Article

Now that we have a basic table of contents we should create a link to navigate to each article. Whenever you need to navigate to another page within the same Gatsby site you should use the `Link` component provided by Gatsby because it has some really clever optimizations at runtime to speed up loading the target page.

```js
const IndexPage = ({ data }) => {
  return (
    <div>
      <SEO title="Centeva Blog" />
      <h1>Centeva Blog</h1>

      {data.allMarkdownRemark.edges.map(({ node }) => (
        <div key={node.id}>
          <h2>
            <Link to={node.frontmatter.path}>{node.frontmatter.title}</Link>
          </h2>
          <p>{node.frontmatter.author}</p>
          <p>{node.excerpt}</p>
        </div>
      ))}
    </div>
  )
}
```

This looks great but when we click on those links we get a 404 because those pages don't exist yet.

# Use the Gatsby Pipeline to Generate Blog Pages

Now we need to tell Gatsby how to create each of those pages. The way to do that is to create a new hook into the Gatsby build pipeline in the `gatsby-node.js` file.

```js
exports.createPages = async ({ actions, graphql, reporter }) => {
  // TODO: Discover and build the blog pages here
}
```

Similar to pages and components this code needs to query GraphQL to get the data it needs. That is done by calling the `graphql` function again.

Once we have the data we will use Gatsby's `createPage` function to create a new dynamic page.

```js
exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(`Error fetching blogs`)
    return
  }

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.path,
      component: template /* we will create this in the next step */,
    })
  })
}
```

In this case we only care about the path declared in each markdown file. The rest of the data for this blog entry will be fetched by the template we're going to create in just a second.

# Create the Blog Page Template

Now we need to create the template used to create each blog page. A sensible place to put that template would be in a new folder named `templates`. Let's create a new file called `blogTemplate.js` in that folder.

This template will need to fetch the data and render it. The GraphQL query can be parameterized in a way that works with the `createPage` function. The query accepts a `$path` parameter which comes from the page path specified in `createPage` above. That `$path` is then used to look up a single markdown file.

We will include the `html` property created by Remark which will be the main body of our blog article. One handy way to get the specific values of the `data` prop is to use destructuring which you can see in this implementation.

```js
/* blogTemplate.js */

import React from "react"
import { graphql } from "gatsby"

export default function BlogTemplate({ data }) {
  const { markdownRemark } = data
  const { frontmatter, html } = markdownRemark

  return (
    <article>
      <h1>{frontmatter.title}</h1>
      <h2>{frontmatter.date}</h2>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  )
}
export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`
```

# Load the Template from Disk

Now we need to connect the new template to the code in `gatsby-node.js`.

```js
const path = require(`path`)

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const template = path.resolve(`src/templates/blogTemplate.js`)

  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(`Error fetching blogs`)
    return
  }

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.path,
      component: template,
    })
  })
}
```

Changes to `gatsby-node.js` are not picked up by the `gatsby develop` watcher so you'll need to re-start that now. Once you do you should have a functional blog!

# Make it Stylish

Now that we have the basic content it's time to make it look good. For this I think it's a good idea to use SCSS so we'll need to make sure our project is set up to process `*.scss` files. To do that all we need to do is add the `node-sass` package.

Stop the `gatsby develop` process since we're adding a new NPM package.

```
npm i --save node-sass
```

Now let's add new stylesheets:

- `pages/index.module.scss`
- `templates/blogTemplate.module.scss`

You will then need to import those stylesheets into each component.

```js
/* index.js */

import style from "./index.module.scss"
```

```js
/* blogTemplate.js */

import style from "./blogTemplate.module.scss"
```

Now you will be able to start defining styles and referencing them in the components.

```js
/* blogTemplate.js */

export default function BlogTemplate({ data }) {
  const { markdownRemark } = data
  const { frontmatter, html } = markdownRemark

  return (
    <article className={style.blog}>
      <h1>{frontmatter.title}</h1>
      <h2>{frontmatter.date}</h2>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  )
}
```

```css
/* blogTemplate.module.scss */

.blog {
  /* go to town with styles here!
  Remember that scss lets you nest styles for convenience. */
}
```

# Gatsby Images

Even though you now have a snazzy-looking blog it would really look better with some images. It would be nice to show the author's avatar with each page.

Fortunately, Gatsby provides a handy set of tools to help make optimized and responsive images to use in your site. The default starter app comes pre-loaded with `gatsby-image`, `gatsby-plugin-sharp`, and `gatsby-transformer-sharp` to help you with images. These tools help you query, resize, and optimize images.

In general you can include either _fixed-size_ images or _fluid_ images in your site. As you probably guessed, you need to know up front what size you want when using _fixed-size_ images. _Fluid_ images can be stretched/shrunk as needed. Gatsby can auto-create _source sets_ automatically to help the browser select the optimal resolution image for each screen size.

The `gatsby-transformer-sharp` plugin makes it so that GraphQL can query for images and specify size, quality, etc. Generally you will find this functionality in _GraphiQL_ under properties named `childImageSharp`.

Since the frontmatter of each blog post has a link to an avatar image you can query for the image in _GraphiQL_. The sample below shows both the `fixed` and `fluid`.

For 'fixed' images an error will be thrown if your specified `width` parameter is smaller than any image width so be careful there. I have not seen any errors thrown with the `fluid` type's `maxWidth` parameter.

```
query MyQuery {
  allMarkdownRemark {
    edges {
      node {
        timeToRead
        excerpt
        frontmatter {
          avatar {
            childImageSharp {
              fixed(width: 128) {
                aspectRatio
                width
                height
                src
                srcSet
              }
              fluid(maxWidth: 250) {
                aspectRatio
                sizes
                src
                srcSet
              }
            }
          }
        }
      }
    }
  }
}
```

Let's use the `fluid` variant in our queries.

```js
/* index.js */

export const query = graphql`
  {
    allMarkdownRemark {
      edges {
        node {
          excerpt
          frontmatter {
            author
            path
            title
            avatar {
              childImageSharp {
                fluid(maxWidth: 250) {
                  aspectRatio
                  sizes
                  src
                  srcSet
                }
              }
            }
          }
        }
      }
    }
  }
`
```

Gatsby provides a handy component that understands the `fluid` image info. All you need to do is import the component then use it in your components.

```
/* index.js */

import Img from 'gatsby-image'
  ...
<Img fluid={node.frontmatter.avatar.childImageSharp.fluid} />
  ...
```

```
/* blogTemplate.js */

import Img from 'gatsby-image'
  ...
<Img fluid={frontmatter.avatar.childImageSharp.fluid} />
  ...

```

# Final Step

Once you've got your site built and published post a link in the Logan channel to show off your amazing new blog!

I hope you enjoyed this tutorial and learned something in the process. If you would like to write a new blog post for the _real_ Centeva blog we would love to read it!
