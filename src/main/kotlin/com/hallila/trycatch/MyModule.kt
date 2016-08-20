package com.hallila.trycatch

import com.fasterxml.jackson.dataformat.yaml.snakeyaml.Yaml
import com.google.inject.AbstractModule
import com.google.inject.multibindings.Multibinder
import com.google.inject.name.Names
import com.hallila.trycatch.repository.TestRepository
import com.hallila.trycatch.repository.TestRepositoryImpl
import com.hallila.trycatch.service.TestHandler
import ratpack.handling.HandlerDecorator
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Paths
import java.util.*


class MyModule : AbstractModule() {

    override fun configure() {
        bindProperties()
        bind(MyService::class.java).to(MyServiceImpl::class.java)
        bind(TestRepository::class.java).to(TestRepositoryImpl::class.java)
        bind(MyHandler::class.java)
        bind(TestHandler::class.java)
        Multibinder.newSetBinder(binder(), HandlerDecorator::class.java)
                .addBinding()
                .toInstance(HandlerDecorator.prepend(LoggingHandler()))
    }

    @Throws(IOException::class)
    fun bindProperties() {
        val yaml = Yaml()
        fun prefixKeys(key: String, value: Map<*, *>): Map<String, *> {
            return value.mapKeys { key + "." + it.key.toString() }
        }
        Files.newInputStream(Paths.get("properties.yaml")).use({ `in` ->
            val config = yaml.loadAs(`in`, Properties::class.java)
            config.forEach { str, property ->
                fun mapProps(key: String, value: Any) {
                    when (value) {
                        is Map<*, *> -> prefixKeys(key, value).forEach { mapProps(it.key, it.value!!) }
                        is String -> bindConstant().annotatedWith(Names.named(key)).to(value.toString())
                        else -> bindConstant().annotatedWith(Names.named(key)).to(value.toString())
                    }
                }
                mapProps(str.toString(), property)
            }
        })
    }

}
