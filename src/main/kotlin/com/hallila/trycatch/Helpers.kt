@file:Suppress("Unused")

/*
 * Helper functions to make the app more Kotlin like.
 */

package com.hallila.trycatch

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import ratpack.guice.BindingsSpec
import ratpack.handling.Chain
import ratpack.handling.Context
import ratpack.registry.Registry
import ratpack.registry.RegistrySpec
import ratpack.server.RatpackServer
import ratpack.server.RatpackServerSpec
import ratpack.server.ServerConfigBuilder
import kotlin.reflect.KClass
import kotlin.reflect.companionObject
import ratpack.guice.Guice.registry as guiceRegistry

fun serverOf(cb: KServerSpec.() -> Unit) = RatpackServer.of { KServerSpec(it).cb() }
fun serverStart(cb: KServerSpec.() -> Unit) = RatpackServer.start { KServerSpec(it).cb() }

class KChain(val delegate: Chain) : Chain by delegate {
    fun fileSystem(path: String = "", cb: KChain.() -> Unit) =
        delegate.fileSystem(path) { KChain(it).cb() }

    fun prefix(path: String = "", cb: KChain.() -> Unit) =
        delegate.prefix(path) { KChain(it).cb() }

    fun all(cb: Context.() -> Unit) = delegate.all { it.cb() }
    fun path(path: String = "", cb: Context.() -> Unit) = delegate.path(path) { it.cb() }

    @Suppress("ReplaceGetOrSet")
    fun get(path: String = "", cb: Context.() -> Unit) = delegate.get(path) { it.cb() }

    fun put(path: String = "", cb: Context.() -> Unit) = delegate.put(path) { it.cb() }
    fun post(path: String = "", cb: Context.() -> Unit) = delegate.post(path) { it.cb() }
    fun delete(path: String = "", cb: Context.() -> Unit) = delegate.delete(path) { it.cb() }
    fun options(path: String = "", cb: Context.() -> Unit) = delegate.options(path) { it.cb() }
    fun patch(path: String = "", cb: Context.() -> Unit) = delegate.patch(path) { it.cb() }
}

class KContext(val delegate: Context) : Context by delegate

class KServerSpec(val delegate: RatpackServerSpec) : RatpackServerSpec by delegate {
    fun serverConfig(cb: ServerConfigBuilder.() -> Unit) = delegate.serverConfig { it.cb() }
    fun registry(cb: RegistrySpec.() -> Unit) = delegate.registry(Registry.of(cb))
    fun guiceRegistry(cb: BindingsSpec.() -> Unit) =
        delegate.registry(guiceRegistry { bindings: BindingsSpec -> bindings.cb() })

    fun handlers(cb: KChain.() -> Unit) = delegate.handlers { KChain(it).cb() }
}

public fun <T : Any> logger(forClass: Class<T>): Logger {
    return LoggerFactory.getLogger(unwrapCompanionClass(forClass).name)
}

public fun <T : Any> unwrapCompanionClass(ofClass: Class<T>): Class<*> {
    return if (ofClass.enclosingClass != null && ofClass.enclosingClass.kotlin.companionObject?.java == ofClass) {
        ofClass.enclosingClass
    } else {
        ofClass
    }
}

public fun <T : Any> unwrapCompanionClass(ofClass: KClass<T>): KClass<*> {
    return unwrapCompanionClass(ofClass.java).kotlin
}

public fun <T : Any> logger(forClass: KClass<T>): Logger {
    return logger(forClass.java)
}

public fun <T : Any> T.logger(): Logger {
    return logger(this.javaClass)
}

public fun <R : Any> R.lazyLogger(): Lazy<Logger> {
    return lazy { logger(this.javaClass) }
}

public fun <R : Any> R.injectLogger(): Lazy<Logger> {
    return lazyOf(logger(this.javaClass))
}

interface Loggable {}

public fun Loggable.logger(): Logger = logger(this.javaClass)
public abstract class WithLogging : Loggable {
    val LOG = logger()
}

