import React, { useState } from "react";
import UAParser from "ua-parser-js";

const UcupDL = () => {
  const devicesInfo = new UAParser().getResult();

  return (
    <div className="container mx-auto max-w-xl space-y-6 p-6 text-center font-quicksand border rounded shadow-lg m-6">
      <h1 className="text-center text-2xl">
        UcupDL - Pengunduh YouTube sederhana
      </h1>
      <img
        src="/img/logos/ucupdl.png"
        alt="UcupDL App Logo"
        className="w-64 h-64 object-container mx-auto"
      />

      <div
        className="border-2 
      p-3 m-3 "
      >
        <ul className="space-y-3 text-left">
          <li>Nama : UcupDL - Pengunduh YouTube sederhana</li>
          <li>Deskripsi : Pengunduhan Video dan Audio YouTube dengan mudah</li>
          <li>Versi Aplikasi : 1.0.0</li>
          <li>
            Pengembang :{" "}
            <a
              href="https://github.com/marzukiberg/"
              className="text-red-500 font-bold"
              target="_blank"
            >
              @marzukiberg
            </a>
          </li>
          <li>
            Github Repo :{" "}
            <a
              href="https://github.com/marzukiberg/UcupDL"
              className="text-red-500 font-bold"
              target="_blank"
            >
              UcupDL Github
            </a>
          </li>
          <li>
            Screenshots :
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <img src="/img/projects/ucupdl/1.jpg" alt="UcupDL" />
              <img src="/img/projects/ucupdl/2.jpg" alt="UcupDL" />
              <img src="/img/projects/ucupdl/3.jpg" alt="UcupDL" />
              <img src="/img/projects/ucupdl/4.jpg" alt="UcupDL" />
            </div>
          </li>
          <hr />
          <li>
            Download :
            <div className="my-3 gap-3 grid md:grid-cols-2 place-items-center">
              <a
                className="mx-auto bg-green-500 px-4 py-2 text-center text-white"
                href="/apks/ucupdl/app-armeabi-v7a-release.apk"
              >
                <i className="fas fa-download"></i>
                <span className="ml-2">Download: armeabi-v7a</span>
              </a>
              <a
                className="mx-auto bg-green-500 px-4 py-2 text-center text-white"
                href="/apks/ucupdl/app-arm64-v8a-release.apk"
              >
                <i className="fas fa-download"></i>
                <span className="ml-2">Download: arm64-v8a</span>
              </a>
            </div>
            <p>
              Bingung menentukan download? cek arsitektur perangkat Saya di{" "}
              <a
                href="https://www.whatsmyua.info/"
                target="_blank"
                className="text-red-500"
              >
                https://www.whatsmyua.info/
              </a>{" "}
              atau
              <a
                href={`https://play.google.com/store/apps/details?id=com.cpuid.cpu_z&hl=in&gl=US`}
                target="_blank"
                className="text-red-500"
              >
                aplikasi CPU-Z
              </a>
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UcupDL;
