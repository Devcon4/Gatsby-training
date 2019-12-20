/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require('path');

exports.createPages = async ({ actions, graphql, reporter }) => {
    const { createPage } = actions;
    const template = path.resolve('src/templates/blogTemplate.js');

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

    `);

    if(result.errors) {
        reporter.panicOnBuild('Error fetching blogs');
        return;
    }

    result.data.allMarkdownRemark.edges.forEach(({node})=> {
        createPage({
            path: node.forntmatter.path,
            component: template
        })
    })
}
