package com.hallila.trycatch.handler

import com.hallila.trycatch.WithLogging
import com.hallila.trycatch.service.AssertionService
import com.hallila.trycatch.service.HttpClientService
import com.hallila.trycatch.service.ResponseParsingService
import io.netty.handler.codec.http.HttpResponseStatus
import org.json.JSONObject
import ratpack.handling.Context
import ratpack.handling.Handler
import ratpack.jackson.Jackson.jsonNode
import ratpack.rx.RxRatpack
import javax.inject.Inject
import javax.inject.Singleton


@Singleton class HttpRequestHandler @Inject constructor(val client: HttpClientService) : Handler, WithLogging() {
    override fun handle(ctx: Context) {
        ctx.parse(jsonNode()).map {
            val node = it.get("json")
            LOG.debug("Got Json {}", node)
            JSONObject(node.toString())
        }.onError { e ->
            LOG.warn("Failed to parse JSON", e)
            ctx.response.status(HttpResponseStatus.UNPROCESSABLE_ENTITY.code()).send("Failed to Parse JSON: ${e.message}")
        }.then { json ->
            RxRatpack.promiseSingle(client.get("http://jsonplaceholder.typicode.com/posts/1")
            ).onError { e ->
                LOG.warn("Failed to make request to external API", e)
                ctx.response.status(HttpResponseStatus.FAILED_DEPENDENCY.code()).send("Failed to make request to external API: ${e.message}")
            }.then { x ->
                val result = AssertionService.assertEquals(json, x)
                ctx.response.send(ResponseParsingService.parseQueryResponse(result))
            }
        }
    }
}