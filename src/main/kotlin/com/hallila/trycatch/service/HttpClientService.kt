package com.hallila.trycatch.service

import com.google.inject.Inject
import com.google.inject.Singleton
import com.hallila.trycatch.boundary.RetrofitService
import retrofit2.Response
import rx.Observable

interface HttpClientService {
    fun get(url: String): Observable<QueryResult>
}

@Singleton class HttpClientServiceImpl @Inject constructor(val api: RetrofitService) : HttpClientService {
    override fun get(url: String): Observable<QueryResult> =
        api.get(url).map {
            QueryResult(it)
        }
}

data class QueryResult(val body: String, val responseCode: Int) {
    constructor(res: Response<String>)
    : this(if (res.isSuccessful) res.body() else res.errorBody().string(), res.code())
}
