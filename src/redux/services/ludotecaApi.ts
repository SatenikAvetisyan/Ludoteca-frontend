import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Category } from "../../types/Category";
import type { Author, AuthorResponse } from "../../types/Author";

export const ludotecaAPI = createApi({
  reducerPath: "ludotecaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
  }),
  tagTypes: ["Category", "Author", "Game"],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], null>({
      query: () => "category",
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation({
      query: (payload) => ({
        url: "/category",
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (id: string) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: (payload: Category) => ({
        url: `category/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Category"],
    }),
    getAllAuthors: builder.query<Author[], null>({
        query: () => "author",
        providesTags: ["Author" ],
      }),
      getAuthors: builder.query<
        AuthorResponse,
        { pageNumber: number; pageSize: number }
      >({
        query: ({ pageNumber, pageSize }) => {
          return {
            url: "author",
            method: "POST",
            body: {
              pageable: {
                pageNumber,
                pageSize,
              },
            },
          };
        },
        providesTags: ["Author"],
      }),
      createAuthor: builder.mutation({
        query: (payload) => ({
          url: "/author",
          method: "PUT",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }),
        invalidatesTags: ["Author"],
      }),
      deleteAuthor: builder.mutation({
        query: (id: string) => ({
          url: `/author/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Author"],
      }),
      updateAuthor: builder.mutation({
        query: (payload: Author) => ({
          url: `author/${payload.id}`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: ["Author", "Game"],
      }),
  }),
});

export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
    useUpdateCategoryMutation,
    useCreateAuthorMutation,
    useDeleteAuthorMutation,
    useGetAllAuthorsQuery,
    useGetAuthorsQuery,
    useUpdateAuthorMutation,
} = ludotecaAPI;