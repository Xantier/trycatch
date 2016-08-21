package com.hallila.trycatch.service

import ratpack.exec.Promise
import ratpack.http.client.HttpClient
import java.net.URI

class HttpClientServiceImpl : HttpClientService {
    override fun get(httpClient: HttpClient, url: String): Promise<QueryResult> {
        return httpClient.get(URI.create(url))
                .map {
                    QueryResult(it.body.text, it.statusCode)
                }
    }
}

data class QueryResult(val body: String, val responseCode: Int)
