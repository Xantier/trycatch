package com.hallila.trycatch.boundary


import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Url
import rx.Observable


interface RetrofitService {
    @GET
    fun get(@Url url: String): Observable<Response<String>>
}