package com.hallila.trycatch.model

import com.fasterxml.jackson.databind.JsonNode
import com.github.kittinunf.fuel.core.Method
import org.json.JSONArray
import org.json.JSONObject

data class Scenario(val name: String, val steps: List<Step<*>>) {
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
                        val request = entry["request"] as Map<*, *>
                        val payload = entry["payload"] as String
                        val path = request["path"] as String
                        val method = Method.valueOf(request["method"].toString().toUpperCase())
                        JsonAssertionStep(entryName, payload, JsonExpectation(jsonContent(entry)),
                            Request(method, path, request["params"] as Map<String, String>))
                    }
                    StepKey.SELECT -> {
                        val expectation = entry["expectation"] as Map<*, *>
                        SelectStep(entryName, entry["statement"] as String, CsvExpectation(expectation["value"] as List<String>))
                    }
                }
            }
            return Scenario(name, steps)
        }

        private fun content(entry: Map<*, *>): String {
            val expectation = entry["expectation"] as Map<*, *>
            val content = expectation["value"] as String
            return content
        }

        private fun jsonContent(entry: Map<*, *>): String {
            val expectation = entry["expectation"] as Map<*, *>
            val exp = expectation["value"] as Map<*, *>
            val content = exp["content"] as String
            return content
        }

        fun buildFromJson(input: JsonNode): Scenario {
            val QUERY = "query"
            val REQUEST = "request"
            val INSERT = "insert"
            val SELECT = "select"
            val EXPECTATION = "expectation"
            val name = "fromTheWeb"
            val steps = input.fields().asSequence().map {
                when (it.key) {
                    REQUEST -> JsonAssertionStep(REQUEST + name, it.value.get("payload").toString(), JsonExpectation(it.value.get("payload").toString()),
                        Request(Method.POST, "http://jsonplaceholder.typicode.com/posts/1", emptyMap<String, String>()), StepKey.REQUEST)

                    INSERT -> InsertStep(INSERT + name, it.value.get(QUERY).asText(), DatabaseResponseExpectation("Done successfully"), StepKey.INSERT)

                    SELECT -> SelectStep(SELECT + name, it.value.get(QUERY).asText(), CsvExpectation(listOf(it.value.get(EXPECTATION).asText())), StepKey.SELECT)
                    else -> throw RuntimeException("Unable to parse posted JSON :(")
                }
            }.toList()
            return Scenario(name, steps)
        }
    }
}

data class InsertStep(override val name: String, val statement: String, override val expectation: DatabaseResponseExpectation, override val type: StepKey = StepKey.INSERT) : DatabaseStep<String>
data class JsonAssertionStep(override val name: String, val payload: String, override val expectation: JsonExpectation, val request: Request, override val type: StepKey = StepKey.REQUEST) : HttpStep<Json>
data class SelectStep(override val name: String, val statement: String, override val expectation: CsvExpectation, override val type: StepKey = StepKey.SELECT) : DatabaseStep<List<String>>

data class CsvExpectation(override val value: List<String>) : Expectation<List<String>>
data class DatabaseResponseExpectation(override val value: String) : Expectation<String>
data class JsonExpectation(override val value: Json) : Expectation<Json> {
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

class Json(val content: String) {
    fun obj(): JSONObject = JSONObject(content)
    fun array(): JSONArray = JSONArray(content)
    override fun toString(): String = obj().toString()
}

enum class StepKey() {
    INSERT, REQUEST, SELECT
}