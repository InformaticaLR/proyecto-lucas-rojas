import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { logout } from "@/lib/actions";

async function Header() {
  const session = await auth();

  return (
    <header
      className={`bg-amber-50 flex md:flex-row justify-between items-center md:justify-between md:px-5 font-Rounded font-bold`}
    >
      <div className="hidden lg:flex">
        <Image
          src="/images/logo.png"
          alt=""
          width={100}
          height={24}
        />
        <ul className="flex space-x-5 text-black md:space-x-32 text-[2vh]">
          {session && <li className="transition duration-500 hover:text-blue-700">
            <Link href="/dashboard">Inicio</Link>
          </li>}
          {<li>
            {session?.user?.role == 'ADMIN'
              && <Link href="/registro" className=' transition duration-500 hover:text-blue-700'>Añadir usuario</Link>
            }
          </li>}
        </ul>
      </div>
      <div className=" ">
        {session ? (
          <>
            <p className="text-black">Sesión iniciada como {session.user.name}</p>
            <form>
              <button
                formAction={logout}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >Cerrar sesión</button>
            </form>
          </>
        ) : (
          <p className="text-black">Aún no has iniciado sesión</p>
        )}
      </div>
    </header>
  );
}

export default Header;