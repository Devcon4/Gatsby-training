import React from "react";
import { graphql, Link } from "gatsby";
import Img from 'gatsby-image'
import style from "./index.module.scss";

import SEO from "../components/seo"

const IndexPage = ({ data }) => (
  <div className={style.content}>
    <SEO title="Centeva Blog" />
    <h1 style={{width: "120px", }} className={style.header}>Centeva Blog</h1>
    {data.allMarkdownRemark.edges.map(({node}) => (
      <div className={style.blogcard} key={node.id}>
        <Img className={style.image} fluid={node.frontmatter.avatar.childImageSharp.fluid} />
        <h2><Link to={node.frontmatter.path}>{node.frontmatter.title}</Link></h2>
        <p>{node.frontmatter.author}</p>
        <p>{node.excerpt}</p>
      </div>
    ))}
  </div>
)

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
`;