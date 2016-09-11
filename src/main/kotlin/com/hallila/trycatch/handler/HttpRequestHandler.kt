package com.hallila.trycatch.handler

import com.hallila.trycatch.service.AssertionService
import com.hallila.trycatch.service.HttpClientService
import com.hallila.trycatch.service.ResponseParsingService
import org.json.JSONObject
import ratpack.handling.Context
import ratpack.handling.Handler
import ratpack.jackson.Jackson.jsonNode
import ratpack.rx.RxRatpack
import javax.inject.Inject
import javax.inject.Singleton


@Singleton class HttpRequestHandler @Inject constructor(val client: HttpClientService) : Handler {
    override fun handle(ctx: Context) {
        ctx.parse(jsonNode()).map {
            JSONObject(it.get("json").asText())
        }.onError { e ->
            ctx.response.status(422).send("Failed to Parse JSON: " + e.message)
        }.then { json ->
            RxRatpack.promiseSingle(client.get("http://jsonplaceholder.typicode.com/posts/1")
            ).then { x ->
                val result = AssertionService.assertEquals(json, x)
                ctx.response.send(ResponseParsingService.parseQueryResponse(result))
            }
        }
    }
}