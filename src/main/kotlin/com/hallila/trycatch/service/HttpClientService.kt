package com.hallila.trycatch.service

import com.github.kittinunf.fuel.core.Method
import com.google.inject.Singleton
import com.hallila.trycatch.boundary.HttpClient
import com.hallila.trycatch.handler.JsonHelpers.MEDIA_TYPE_JSON
import com.hallila.trycatch.model.Request
import okhttp3.Headers
import okhttp3.RequestBody
import okhttp3.Response
import rx.Observable

interface HttpClientService {
    fun get(url: String, headers: Map<String, String>): Observable<QueryResult>
    fun post(url: String, payload: String, headers: Map<String, String>): Observable<QueryResult>
    fun put(url: String, payload: String, headers: Map<String, String>): Observable<QueryResult>
    fun delete(url: String, payload: String, headers: Map<String, String>): Observable<QueryResult>

    fun call(request: Request, payload: String): Observable<QueryResult>
}

@Singleton class HttpClientServiceImpl @javax.inject.Inject constructor(val client: HttpClient) : HttpClientService {

    override fun call(request: Request, payload: String): Observable<QueryResult> =
        when (request.method) {
            Method.GET    -> get(request.path, request.params)
            Method.POST   -> post(request.path, payload, request.params)
            Method.PUT    -> put(request.path, payload, request.params)
            Method.DELETE -> delete(request.path, payload, request.params)
            Method.PATCH  -> TODO()
            Method.HEAD   -> TODO()
        }

    override fun get(url: String, headers: Map<String, String>): Observable<QueryResult> {
        val request = okhttp3.Request.Builder().url(url).headers(toHeaders(headers)).get().build()
        return client.execute(request).map(::QueryResult)
    }

    override fun post(url: String, payload: String, headers: Map<String, String>): Observable<QueryResult> {
        val request = okhttp3.Request.Builder().url(url).headers(toHeaders(headers)).post(requestBody(payload)).build()
        return client.execute(request).map(::QueryResult)
    }

    override fun put(url: String, payload: String, headers: Map<String, String>): Observable<QueryResult> {
        val request = okhttp3.Request.Builder().url(url).headers(toHeaders(headers)).put(requestBody(payload)).build()
        return client.execute(request).map(::QueryResult)
    }

    override fun delete(url: String, payload: String, headers: Map<String, String>): Observable<QueryResult> {
        val request = okhttp3.Request.Builder().url(url).headers(toHeaders(headers)).delete(requestBody(payload)).build()
        return client.execute(request).map(::QueryResult)
    }

    private fun requestBody(payload: String) = RequestBody.create(MEDIA_TYPE_JSON, payload)
    private fun toHeaders(headers: Map<String, String>): Headers = Headers.of(headers)
}

data class QueryResult(val response: Response, val responseCode: Int) {
    constructor(res: Response)
        : this(res, res.code())
}
