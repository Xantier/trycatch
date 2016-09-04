package com.hallila.trycatch.config

import retrofit2.Retrofit
import retrofit2.adapter.rxjava.RxJavaCallAdapterFactory
import retrofit2.converter.scalars.ScalarsConverterFactory

object RetrofitContext {

    fun build(): Retrofit =
        Retrofit.Builder()
            .baseUrl("http://readthisfromsettingfile.com")
            .addConverterFactory(ScalarsConverterFactory.create())
            .addCallAdapterFactory(RxJavaCallAdapterFactory.create())
            .build()
}
