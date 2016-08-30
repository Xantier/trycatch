package com.hallila.trycatch.model

import com.github.kittinunf.fuel.core.FuelManager
import com.github.kittinunf.fuel.core.Method
import com.github.kittinunf.fuel.core.Request
import org.json.JSONArray
import org.json.JSONObject
import java.util.*

class Scenario constructor(steps: List<Step<*>>) {
    init {
        println(steps)
    }
}

class InsertStep(val statement: String, override val expectation: DatabaseResponseExpectation) : Step<String>

class JsonAssertionStep(val payload: String, override val expectation: JsonExpectation, val request: Request = Request()) : Step<Json> {
    constructor(payload: String, expectation: JsonExpectation, method: Method, path: String, param: List<Pair<String, Any?>>?) : this(payload, expectation) {
        val fuelManager = FuelManager.instance
        JsonAssertionStep(payload, expectation, fuelManager.request(method, path, param))
    }
}

class SelectStep(val statement: String, override val expectation: CsvExpectation) : Step<List<String>>

class JsonExpectation(val json: Json) : Expectation<Json> {
    override fun getValue(): Json {
        return json
    }
}

class CsvExpectation(val rows: List<String>) : Expectation<List<String>> {
    override fun getValue(): List<String> {
        return rows
    }
}

class DatabaseResponseExpectation(val response: String) : Expectation<String> {
    override fun getValue(): String {
        return response
    }
}

interface Step<out T> {
    val expectation: Expectation<T>
}

interface Expectation<out T> {
    fun getValue(): T
}

class Json(val content: String) {
    fun obj(): JSONObject = JSONObject(content)
    fun array(): JSONArray = JSONArray(content)
}

class StepKeyMap(m: MutableMap<StepKey, out String>?) : EnumMap<StepKey, String>(m)

enum class StepKey {
    INSERT, JSON, SELECT
}