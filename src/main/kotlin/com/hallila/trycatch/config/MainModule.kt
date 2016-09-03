package com.hallila.trycatch.config

import com.google.inject.AbstractModule
import com.google.inject.multibindings.Multibinder
import com.hallila.trycatch.boundary.Repository
import com.hallila.trycatch.boundary.RepositoryImpl
import com.hallila.trycatch.boundary.RetrofitService
import com.hallila.trycatch.handler.DatabaseInsertHandler
import com.hallila.trycatch.handler.DatabaseSelectHandler
import com.hallila.trycatch.handler.HttpRequestHandler
import com.hallila.trycatch.handler.LoggingHandler
import com.hallila.trycatch.service.DatabaseService
import com.hallila.trycatch.service.DatabaseServiceImpl
import com.hallila.trycatch.service.HttpClientService
import com.hallila.trycatch.service.HttpClientServiceImpl
import ratpack.handling.HandlerDecorator
import ratpack.rx.RxRatpack
import retrofit2.Retrofit
import retrofit2.adapter.rxjava.RxJavaCallAdapterFactory
import retrofit2.converter.scalars.ScalarsConverterFactory

class MainModule : AbstractModule() {

    override fun configure() {
        RxRatpack.initialize()
        val retrofit =
            Retrofit.Builder()
                .baseUrl("http://readthisfromsettingfile.com")
                .addConverterFactory(ScalarsConverterFactory.create())
                .addCallAdapterFactory(RxJavaCallAdapterFactory.create())
                .build()
        val retrofitService = retrofit.create(RetrofitService::class.java)
        bind(Repository::class.java).to(RepositoryImpl::class.java)
        bind(DatabaseService::class.java).to(DatabaseServiceImpl::class.java)
        bind(HttpClientService::class.java).to(HttpClientServiceImpl::class.java)
        bind(HttpRequestHandler::class.java)
        bind(DatabaseInsertHandler::class.java)
        bind(DatabaseSelectHandler::class.java)
        bind(RetrofitService::class.java).toInstance(retrofitService)
        Multibinder.newSetBinder(binder(), HandlerDecorator::class.java)
            .addBinding()
            .toInstance(ratpack.handling.HandlerDecorator.prepend(LoggingHandler()))
    }
}
