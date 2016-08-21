package com.hallila.trycatch.service

import ratpack.exec.Promise
import ratpack.http.client.HttpClient


interface HttpClientService {
    fun get(httpClient: HttpClient, url: String): Promise<QueryResult>
}