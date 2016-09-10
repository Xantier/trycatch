package com.hallila.trycatch.service

import com.github.kittinunf.fuel.core.Method
import com.github.kittinunf.fuel.core.Request
import com.google.inject.Inject
import com.google.inject.Singleton
import com.hallila.trycatch.boundary.RetrofitService
import retrofit2.Response
import rx.Observable

interface HttpClientService {
    fun get(url: String): Observable<QueryResult>
    fun post(url: String): Observable<QueryResult>
    fun put(url: String): Observable<QueryResult>
    fun delete(url: String): Observable<QueryResult>

    fun call(request: Request, payload: String): Observable<QueryResult>
}

@Singleton class HttpClientServiceImpl @Inject constructor(val api: RetrofitService) : HttpClientService {

    override fun call(request: Request, payload: String): Observable<QueryResult> =
        when (request.httpMethod) {
            Method.GET -> get(request.path)
            Method.POST -> post(request.path)
            Method.PUT -> put(request.path)
            Method.DELETE -> delete(request.path)
            Method.PATCH -> TODO()
            Method.HEAD -> TODO()
        }

    override fun get(url: String): Observable<QueryResult> =
        api.get(url).map { QueryResult(it) }

    override fun post(url: String): Observable<QueryResult> =
        api.post(url).map { QueryResult(it) }

    override fun put(url: String): Observable<QueryResult> =
        api.put(url).map { QueryResult(it) }

    override fun delete(url: String): Observable<QueryResult> =
        api.delete(url).map { QueryResult(it) }
}

data class QueryResult(val body: String, val responseCode: Int) {
    constructor(res: Response<String>)
    : this(if (res.isSuccessful) res.body() else res.errorBody().string(), res.code())
}
