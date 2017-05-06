package com.hallila.trycatch.model

import com.fasterxml.jackson.databind.JsonNode
import com.github.kittinunf.fuel.core.Method
import com.hallila.trycatch.handler.JsonHelpers
import com.hallila.trycatch.handler.httpMethodFromString
import com.hallila.trycatch.handler.parseHttpRequest
import org.json.JSONArray
import org.json.JSONObject

data class Scenario(val name: String, val steps: List<Step<*>>) {
    @Suppress("UNCHECKED_CAST")
    companion object Factory {
        fun build(input: Map<String, Any>): Scenario {
            val name = input["name"] as String
            val stepYaml = input["steps"] as List<Map<*, *>>
            val steps = stepYaml.map { entry ->
                val entryName = entry["name"] as String
                val value = entry["type"]
                when (StepKey.valueOf(value as String)) {
                    StepKey.INSERT -> {
                        InsertStep(entryName, entry["statement"] as String, DatabaseResponseExpectation(content(entry)))
                    }
                    StepKey.REQUEST -> {
                        val request = entry[JsonHelpers.REQUEST] as Map<*, *>
                        val payload = entry[JsonHelpers.PAYLOAD] as String
                        val path = request["path"] as String
                        val method = Method.valueOf(request["method"].toString().toUpperCase())
                        JsonAssertionStep(entryName, payload, JsonExpectation(jsonContent(entry)),
                            Request(method, path, request["params"] as Map<String, String>))
                    }
                    StepKey.SELECT -> {
                        val expectation = entry[JsonHelpers.EXPECTATION] as Map<*, *>
                        SelectStep(entryName, entry["statement"] as String, CsvExpectation(expectation["value"] as List<String>))
                    }
                }
            }
            return Scenario(name, steps)
        }

        private fun content(entry: Map<*, *>): String {
            val expectation = entry[JsonHelpers.EXPECTATION] as Map<*, *>
            val content = expectation["value"] as String
            return content
        }

        private fun jsonContent(entry: Map<*, *>): String {
            val expectation = entry[JsonHelpers.EXPECTATION] as Map<*, *>
            val exp = expectation["value"] as Map<*, *>
            val content = exp["content"] as String
            return content
        }

        fun buildFromJson(input: JsonNode): Scenario {
            val name = input.get("name").asText()
            val steps = input.fields().asSequence()
                .filter { it.key != "name" }
                .map {
                    when (it.key) {
                        JsonHelpers.REQUEST ->
                            parseHttpRequest(it.value, httpMethodFromString(it.value.get(JsonHelpers.METHOD).asText()), JsonHelpers.REQUEST + " " + name)
                        JsonHelpers.INSERT ->
                            InsertStep(JsonHelpers.INSERT + " " + name, it.value.get(JsonHelpers.QUERY).asText(),
                                DatabaseResponseExpectation("Done successfully"),
                                StepKey.INSERT)

                        JsonHelpers.SELECT ->
                            SelectStep(JsonHelpers.SELECT + " " + name, it.value.get(JsonHelpers.QUERY).asText(),
                                CsvExpectation(listOf(it.value.get(JsonHelpers.EXPECTATION).asText())),
                                StepKey.SELECT)
                        else ->
                            throw RuntimeException("Unable to parse posted JSON :(")
                    }
                }.toList()
            return Scenario(name, steps)
        }
    }
}

data class InsertStep(
    override val name: String,
    val statement: String,
    override val expectation: DatabaseResponseExpectation,
    override val type: StepKey = StepKey.INSERT
) : DatabaseStep<String>

data class JsonAssertionStep(
    override val name: String,
    val payload: String,
    override val expectation: JsonExpectation,
    val request: Request,
    override val type: StepKey = StepKey.REQUEST
) : HttpStep<Json>

data class SelectStep(
    override val name: String,
    val statement: String,
    override val expectation: CsvExpectation,
    override val type: StepKey = StepKey.SELECT
) : DatabaseStep<List<String>>

data class CsvExpectation(override var value: List<String>) : Expectation<List<String>>
data class DatabaseResponseExpectation(override var value: String) : Expectation<String>
data class JsonExpectation(override var value: Json = Json()) : Expectation<Json> {
    constructor(value: String) : this(Json(value))
}

data class Request(val method: Method, val path: String, val params: Map<String, String>)

interface Expectation<out T> {
    val value: T
}

interface DatabaseStep<out T> : Step<T>
interface HttpStep<out T> : Step<T>
interface Step<out T> {
    val name: String
    val expectation: Expectation<T>
    val type: StepKey
}

class Json(val content: String = "{}") {
    fun obj(): JSONObject = if (content == "{}") JSONObject() else JSONObject(content)
    fun array(): JSONArray = if (content == "{}") JSONArray() else JSONArray(content)
    override fun toString(): String = try {
        obj().toString()
    } catch (e: Exception) {
        ""
    }
}

enum class StepKey() {
    INSERT, REQUEST, SELECT
}