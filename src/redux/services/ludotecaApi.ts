import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type{ Game } from "../../types/Game";
import type{ Category } from "../../types/Category";
import type{ Clients } from "../../types/Clients";
import type{ Loans } from "../../types/Loan";
import type{ Author, AuthorResponse } from "../../types/Author";

export const ludotecaAPI = createApi({
  reducerPath: "ludotecaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
  }),
  tagTypes: ["Category", "Author", "Game", "Clients", "Loans"],
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
    getClients: builder.query<Clients[], null>({
      query: () => "clients",
      providesTags: ["Clients"],
    }),
    createClients: builder.mutation({
      query: (payload) => ({
        url: "/clients",
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Clients"],
    }),
    deleteClients: builder.mutation({
      query: (id: string) => ({
        url: `/clients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clients"],
    }),
    updateClients: builder.mutation({
      query: (payload: Clients) => ({
        url: `clients/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Clients"],
    }),
    getAllAuthors: builder.query<Author[], null>({
      query: () => "author",
      providesTags: ["Author"],
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
    getGames: builder.query<Game[], { title: string; idCategory: string }>({
      query: ({ title, idCategory }) => {
        return {
          url: "game",
          params: { title, idCategory },
        };
      },
      providesTags: ["Game"],
    }),
    createGame: builder.mutation({
      query: (payload: Game) => ({
        url: "/game",
        method: "PUT",
        body: { ...payload },
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Game"],
    }),
    updateGame: builder.mutation({
      query: (payload: Game) => ({
        url: `game/${payload.id}`,
        method: "PUT",
        body: { ...payload },
      }),
      invalidatesTags: ["Game"],
    }),

    getLoans: builder.query<Loans[], { title?: string; clientId?: string; loanDate?: string; returnDate?: string;  }>({
      query: ({ title, clientId, loanDate, returnDate }) => {
        return {
          url: "loan",
          params: { title, clientId, loanDate, returnDate },
        };
      },
      providesTags: ["Loans"],
    }),
    
    createLoan: builder.mutation({
      query: (payload) => ({
        url: "/loan",
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Loans"],
    }),
    
    deleteLoan: builder.mutation({
      query: (id: string) => ({
        url: `/loan/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Loans"],
    }),  
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useGetClientsQuery,
  useCreateClientsMutation,
  useDeleteClientsMutation,
  useUpdateClientsMutation,
  useCreateAuthorMutation,
  useDeleteAuthorMutation,
  useGetAllAuthorsQuery,
  useGetAuthorsQuery,
  useUpdateAuthorMutation,
  useCreateGameMutation,
  useGetGamesQuery,
  useUpdateGameMutation,
  useGetLoansQuery,
  useCreateLoanMutation,
  useDeleteLoanMutation
} = ludotecaAPI;