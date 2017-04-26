package com.hallila.trycatch.boundary


import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import rx.Observable
import java.io.IOException


class HttpClient {
    val client = OkHttpClient()
    fun execute(request: Request): Observable<Response> {
        return Observable.defer {
            try {
                val response = client.newCall(request).execute()
                Observable.just(response)
            } catch (e: IOException) {
                Observable.error<Response>(e)
            }
        }
    }
}

