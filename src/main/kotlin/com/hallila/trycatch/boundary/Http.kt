package com.hallila.trycatch.boundary


import retrofit2.Response
import retrofit2.http.*
import rx.Observable


interface RetrofitService {
    @GET
    fun get(@Url url: String): Observable<Response<String>>

    @POST
    fun post(@Url url: String): Observable<Response<String>>

    @PUT
    fun put(@Url url: String): Observable<Response<String>>

    @DELETE
    fun delete(@Url url: String): Observable<Response<String>>
}