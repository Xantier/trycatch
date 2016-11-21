package com.hallila.trycatch.service

import com.github.kittinunf.fuel.core.Method
import com.google.inject.Inject
import com.google.inject.Singleton
import com.hallila.trycatch.boundary.RetrofitService
import com.hallila.trycatch.model.Request
import okhttp3.MediaType
import okhttp3.RequestBody
import retrofit2.Response
import rx.Observable

interface HttpClientService {
    fun get(url: String, payload: String): Observable<QueryResult>
    fun post(url: String, payload: String): Observable<QueryResult>
    fun put(url: String, payload: String): Observable<QueryResult>
    fun delete(url: String, payload: String): Observable<QueryResult>

    fun call(request: Request, payload: String): Observable<QueryResult>
}

@Singleton class HttpClientServiceImpl @Inject constructor(val api: RetrofitService) : HttpClientService {

    override fun call(request: Request, payload: String): Observable<QueryResult> =
        when (request.method) {
            Method.GET -> get(request.path, payload)
            Method.POST -> post(request.path, payload)
            Method.PUT -> put(request.path, payload)
            Method.DELETE -> delete(request.path, payload)
            Method.PATCH -> TODO()
            Method.HEAD -> TODO()
        }

    override fun get(url: String, payload: String): Observable<QueryResult> =
        //TODO: Convert payload to request params
        api.get(url).map { QueryResult(it) }

    override fun post(url: String, payload: String): Observable<QueryResult> =
        api.post(url, requestBody(payload)).map { QueryResult(it) }

    override fun put(url: String, payload: String): Observable<QueryResult> =
        api.put(url, requestBody(payload)).map { QueryResult(it) }

    override fun delete(url: String, payload: String): Observable<QueryResult> =
        api.delete(url, requestBody(payload)).map { QueryResult(it) }

    private fun requestBody(payload: String) = RequestBody.create(MediaType.parse("application/json"), payload)
}

data class QueryResult(val body: String, val responseCode: Int) {
    constructor(res: Response<String>)
        : this(if (res.isSuccessful) res.body() else res.errorBody().string(), res.code())
}