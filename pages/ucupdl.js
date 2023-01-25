import Head from "next/head";
import Image from "next/legacy/image";
import { imgLoader } from "../utils/img-loader";
const UcupDL = () => {
  return (
    <>
      <Head>
        <title>UcupDL - Pengunduh YouTube sederhana</title>
      </Head>
      <div className="font-qs container m-6 mx-auto max-w-xl space-y-6 rounded border p-6 text-center shadow-lg">
        <h1 className="text-center text-2xl">
          UcupDL - Pengunduh YouTube sederhana
        </h1>
        <div className="object-container relative mx-auto h-64 w-64">
          <Image
            layout="fill"
            src="/img/logos/ucupdl.png"
            loader={imgLoader}
            alt="UcupDL App Logo"
            objectFit="cover"
          />
        </div>

        <div
          className="m-3 
      border-2 p-3 "
        >
          <ul className="space-y-3 text-left">
            <li>Nama : UcupDL - Pengunduh YouTube sederhana</li>
            <li>
              Deskripsi : Pengunduhan Video dan Audio YouTube dengan mudah
            </li>
            <li>Versi Aplikasi : 1.0.0</li>
            <li>
              Pengembang :{" "}
              <a
                href="https://github.com/marzukiberg/"
                className="font-bold text-red-500"
                target="_blank"
                rel="noreferrer"
              >
                @marzukiberg
              </a>
            </li>
            <li>
              Github Repo :{" "}
              <a
                href="https://github.com/marzukiberg/UcupDL"
                className="font-bold text-red-500"
                target="_blank"
                rel="noreferrer"
              >
                UcupDL Github
              </a>
            </li>
            <li>
              Screenshots :
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                <Image
                  width={100}
                  height={200}
                  layout="responsive"
                  objectFit="contain"
                  src="/img/projects/ucupdl/1.jpg"
                  loader={imgLoader}
                  alt="UcupDL"
                />
                <Image
                  width={100}
                  height={200}
                  layout="responsive"
                  objectFit="contain"
                  src="/img/projects/ucupdl/2.jpg"
                  loader={imgLoader}
                  alt="UcupDL"
                />
                <Image
                  width={100}
                  height={200}
                  layout="responsive"
                  objectFit="contain"
                  src="/img/projects/ucupdl/3.jpg"
                  loader={imgLoader}
                  alt="UcupDL"
                />
                <Image
                  width={100}
                  height={200}
                  layout="responsive"
                  objectFit="contain"
                  src="/img/projects/ucupdl/4.jpg"
                  loader={imgLoader}
                  alt="UcupDL"
                />
              </div>
            </li>
            <hr />
            <li>
              Download :
              <div className="my-3 grid place-items-center gap-3 md:grid-cols-2">
                <a
                  className="mx-auto bg-green-500 px-4 py-2 text-center text-white"
                  href="/apks/ucupdl/app-armeabi-v7a-release.apk"
                >
                  <i className="fas fa-download"></i>
                  <span className="ml-2">Download: ARM</span>
                </a>
                <a
                  className="mx-auto bg-green-500 px-4 py-2 text-center text-white"
                  href="/apks/ucupdl/app-arm64-v8a-release.apk"
                >
                  <i className="fas fa-download"></i>
                  <span className="ml-2">Download: ARM64</span>
                </a>
              </div>
              <p>
                Bingung menentukan download? cek arsitektur perangkat Saya di{" "}
                <a
                  href="https://www.whatsmyua.info/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-500"
                >
                  https://www.whatsmyua.info/
                </a>{" "}
                atau
                <a
                  href={`https://play.google.com/store/apps/details?id=com.cpuid.cpu_z&hl=in&gl=US`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-500"
                >
                  aplikasi CPU-Z
                </a>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default UcupDL;
