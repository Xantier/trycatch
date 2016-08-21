package com.hallila.trycatch.handler

import com.hallila.trycatch.service.HttpClientService
import org.funktionale.either.Either
import org.funktionale.either.eitherTry
import org.json.JSONObject
import org.skyscreamer.jsonassert.JSONAssert
import ratpack.handling.Context
import ratpack.handling.Handler
import ratpack.http.client.HttpClient
import javax.inject.Inject
import javax.inject.Singleton


@Singleton class HttpRequestHandler @Inject constructor(val client: HttpClientService) : Handler {
    override fun handle(ctx: Context) {
        client.get(ctx.get(HttpClient::class.java),
            "http://jsonplaceholder.typicode.com/posts/1")
            .map {
                eitherTry {
                    try {
                        JSONAssert.assertEquals("""
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat proqqvident occaecati excepturi optio reprehenderit",
  "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
}
""", JSONObject(it.body), false)
                        it.body
                    } catch (e: Error) {
                        throw Exception(it.body, e)
                    }

                }
            }
            .then {
                when (it) {
                    is Either.Left  -> ctx.response.send(
                        "Failed! \nExpected " + it.l.message +
                        "\nGot " + it.l.message +
                        "\nError message: " + it.l.cause?.message
                    )
                    is Either.Right -> ctx.response.send("Success: " + it.r)
                }
            }
    }
}