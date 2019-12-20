import React from "react";
import { graphql } from "gatsby";
import Img from 'gatsby-image'
import style from "./BlogTemplate.module.scss";

export default function BlogTemplate({ data}) {
    const { markdownRemark } = data;
    const { frontmatter, html } = markdownRemark;

    return (
        <article>
            <h1>{frontmatter.title}</h1>
            <Img fluid={frontmatter.avatar.childImageSharp.fluid} />
            <h2>{frontmatter.data}</h2>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>
    )
}

export const pageQuery = graphql`
    query($path: String!) {
        markdownRemark(frontmatter: { path: { eq: $path } }) {
            html
            frontmatter {
                date(formatString: "MMM DD, YYYY")
                path
                title
            }
        }
    }
`;
