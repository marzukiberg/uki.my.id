import Head from "next/head";
import Image from "next/image";
import { imgLoader } from "../utils/img-loader";
const UcupDL = () => {
  return (
    <>
      <Head>
        <title>UcupDL - Pengunduh YouTube sederhana</title>
      </Head>
      <div className="container mx-auto max-w-xl space-y-6 p-6 text-center font-quicksand border rounded shadow-lg m-6">
        <h1 className="text-center text-2xl">
          UcupDL - Pengunduh YouTube sederhana
        </h1>
        <div className="w-64 h-64 object-container mx-auto relative">
          <Image
            layout="fill"
            src="/img/logos/ucupdl.png"
            loader={imgLoader}
            alt="UcupDL App Logo"
            objectFit="cover"
          />
        </div>

        <div
          className="border-2 
      p-3 m-3 "
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
                className="text-red-500 font-bold"
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
                className="text-red-500 font-bold"
                target="_blank"
                rel="noreferrer"
              >
                UcupDL Github
              </a>
            </li>
            <li>
              Screenshots :
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
              <div className="my-3 gap-3 grid md:grid-cols-2 place-items-center">
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
