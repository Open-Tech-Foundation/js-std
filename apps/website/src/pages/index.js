import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";
import HeadingWithDivider from "@site/src/components/HeadingWithDivider";
import { FcCheckmark } from "react-icons/fc";
import { FcRight } from "react-icons/fc";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs"
            style={{ display: "flex", justifyContent: "center" }}
          >
            Getting Started{" "}
            <FcRight style={{ fontSize: "26px", marginLeft: "8px" }} />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <HomepageHeader />
      <main style={{ padding: "25px" }}>
        <HeadingWithDivider title="FEATURES" />
        <div className={styles.features}>
          <ul>
            <li>
              {" "}
              <FcCheckmark
                style={{ fontSize: "24px", marginRight: "8px" }}
              />{" "}
              Simple API
            </li>
            <li>
              {" "}
              <FcCheckmark
                style={{ fontSize: "24px", marginRight: "8px" }}
              />{" "}
              TypeScript
            </li>
            <li>
              {" "}
              <FcCheckmark
                style={{ fontSize: "24px", marginRight: "8px" }}
              />{" "}
              ESM
            </li>
          </ul>
        </div>
      </main>
    </Layout>
  );
}
