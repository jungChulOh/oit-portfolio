import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import PostItem from "../components/PostItem";
import DefaultLayout from "../layouts/DefaultLayout";
import NotionService from "../services/NotionService";
import { PageTypeInPageObjectResponse } from "../types";

interface PostsType {
  pages: PageTypeInPageObjectResponse[];
  error: Error;
}

const Posts: React.FC<PostsType> = ({ pages, error }) => {
  if (error) {
    return <div>error</div>;
  }

  return (
    <>
      <Head>
        <title>O.IT Portfolio π</title>
      </Head>

      <DefaultLayout>
        <header className="pt-16 pb-9 sm:pb-16 sm:text-center">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Blog
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            μ μ μμ λ‘μ΄ λΈλ‘κ·Έ κ³΅κ°μΌλ‘ μ΄λν©λλ€.
          </p>
        </header>
        <div className="space-y-16 mx-auto max-w-6xl">
          {pages.length ? (
            pages.map((page) => {
              const { id, pageTitle, createdAt, tag, subTitle } = page;
              return (
                <PostItem
                  key={id}
                  id={id}
                  pageTitle={pageTitle}
                  subTitle={subTitle}
                  createdAt={createdAt}
                  tag={tag}
                />
              );
            })
          ) : (
            <div>
              <h3 className="text-2xl text-slate-700 tracking-tight font-bold dark:text-slate-200 text-center">
                λΈλ‘κ·Έ ν¬μ€ν° μ λ³΄κ° μ‘΄μ¬νμ§ μμ΅λλ€.
              </h3>
              <h3 className="text-xl text-slate-700 tracking-tight font-base dark:text-slate-200 text-center">
                μ‘°κΈλ§ κΈ°λ€λ¦¬μλ©΄ μλ‘μ΄ ν¬μ€ν°κ° μλ‘λλ  μμ μλλ€! π
              </h3>
            </div>
          )}
        </div>
      </DefaultLayout>
    </>
  );
};

export default Posts;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const results = await NotionService.getDevDatabase();

  if (results.length) {
    try {
      const getData = results.map(async (r) => {
        if (r.object === "page") {
          const pageTitle = await NotionService.getPagePropertie(
            r.id,
            r.properties.title.id
          );

          const subTitle = await NotionService.getPagePropertie(
            r.id,
            r.properties.subtitle.id
          );

          const tag = await NotionService.getPagePropertie(
            r.id,
            r.properties.tag.id
          );

          const createdAt = await NotionService.getPagePropertie(
            r.id,
            r.properties.createdAt.id
          );

          return { ...r, pageTitle, tag, createdAt, subTitle };
        }
      });

      const pages = await Promise.all(getData);

      return {
        props: {
          pages,
          error: null,
        },
      };
    } catch (error) {
      return {
        props: {
          pages: null,
          error: error,
        },
      };
    }
  }

  return {
    props: {
      pages: [],
      error: null,
    },
  };
};
