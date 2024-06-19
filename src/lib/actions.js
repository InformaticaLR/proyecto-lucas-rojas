"use server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth, signIn, signOut } from "@/auth";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { google } from 'googleapis';
import fs from 'fs';

// REGISTER
export async function register(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  console.log(email);
  // Comprobamos si el usuario ya está registrado
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (user) {
    return { error: "El email ya está registrado" };
  }

  // Encriptamos password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Guardamos credenciales en base datos
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return { success: "Registro correcto" };
}

// LOGIN credentials
export async function login(formData) {
  const email = formData.get('email')
  const password = formData.get('password')

  // Comprobamos si el usuario está registrado
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (!user) {
    return { error: 'Usuario no registrado.' }
  }

  // Comparamos password 
  const matchPassword = await bcrypt.compare(password, user.password)

  if (user && matchPassword) {  // && user.emailVerified
    await signIn('credentials', { email, password, redirectTo: '/inicio' })
    return { success: "Inicio de sesión correcto" }
  } else {
    return { error: 'Credenciales incorrectas.' }
  }
}


// LOGOUT
export async function logout() {
  try {
    await signOut({ redirectTo: "/" });
  } catch (error) {
    throw error;
  }
}

// Acciones base de datos

export async function getLicitaciones() {
  try {
    const licitaciones = await prisma.licitacion.findMany({
      orderBy: [{
        fechapresentacion: {
          sort: "desc",
          nulls: "last"
        }
      }]
    })
    return licitaciones;
  } catch (error) {
    // console.log(error);  
    return null;
  }
}

export async function getLicitacionesBuscador(formData) {
  const campoABuscar = formData.get("campo");
  const query = formData.get("query");

  try {
    let licitaciones;
    if (campoABuscar === 'fechapresentacion' || campoABuscar === 'fechaformalizacion') {
      // Parse query to get date part only
      const queryDate = new Date(query);
      const queryDateOnly = new Date(queryDate.getFullYear(), queryDate.getMonth(), queryDate.getDate());

      // Adjust the Prisma query to properly filter datetime fields
      licitaciones = await prisma.licitacion.findMany({
        orderBy: [{
          fechapresentacion: {
            sort: 'desc',
            nulls: 'last'
          }
        }],
        where: {
          [campoABuscar]: {
            // Compare only the date part
            gte: queryDateOnly, // greater than or equal to the query date
            lt: new Date(queryDateOnly.getTime() + 24 * 60 * 60 * 1000), // less than the next day
          },
        },
      });
    } else if (campoABuscar === "importe") {
      // For "importe" field, use equals operator
      licitaciones = await prisma.licitacion.findMany({
        orderBy: [{
          fechapresentacion: {
            sort: 'desc',
            nulls: 'last'
          }
        }],
        where: {
          [campoABuscar]: {
            equals: parseFloat(query), // Parse query to float for comparison
          },
        },
      });
    } else {
      // For non-datetime fields, use contains operator
      licitaciones = await prisma.licitacion.findMany({
        orderBy: [{
          fechapresentacion: {
            sort: 'desc',
            nulls: 'last'
          }
        }],
        where: {
          [campoABuscar]: {
            contains: query.toLowerCase(),
            mode: "insensitive"
          },
        },
      });
    }

    return licitaciones;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getLicitacionesAdjudicadasBuscador(formData) {
  const campoABuscar = formData.get("campo");
  const query = formData.get("query");

  try {
    let licitaciones;
    if (campoABuscar === 'fechafinalizacion' || campoABuscar === 'fechaformalizacion') {
      // Parse query to get date part only
      const queryDate = new Date(query);
      const queryDateOnly = new Date(queryDate.getFullYear(), queryDate.getMonth(), queryDate.getDate());

      // Adjust the Prisma query to properly filter datetime fields
      licitaciones = await prisma.licitacion.findMany({
        orderBy: [{
          fechapresentacion: {
            sort: 'desc',
            nulls: 'last'
          }
        }],
        where: {
          AND: [
            {
              [campoABuscar]: {
                // Comparar solo la parte de la fecha
                gte: queryDateOnly, // mayor o igual a la fecha de consulta
                lt: new Date(queryDateOnly.getTime() + 24 * 60 * 60 * 1000), // menor al día siguiente
              },
            },
            {
              estadofinal: {
                equals: "ADJUDICADA",
              },
            },
          ],
        },
      });
    } else if (campoABuscar === "importe") {
      // For "importe" field, use equals operator
      licitaciones = await prisma.licitacion.findMany({
        orderBy: [{
          fechapresentacion: {
            sort: 'desc',
            nulls: 'last'
          }
        }],
        where: {
          AND: [{
            [campoABuscar]: {
              equals: parseFloat(query), // Parse query to float for comparison
            },
            estadofinal: {
              equals: "ADJUDICADA",
            },
          }],
        },
      });
    } else {
      // For non-datetime fields, use contains operator
      licitaciones = await prisma.licitacion.findMany({
        orderBy: [{
          fechapresentacion: {
            sort: 'desc',
            nulls: 'last'
          }
        }],
        where: {
          AND: [
            {
              [campoABuscar]: {
                contains: query.toLowerCase(),
                mode: "insensitive"
              },
              estadofinal: {
                equals: "ADJUDICADA",
              },
            }],
        },
      });
    }

    return licitaciones;
  } catch (error) {
    console.log(error);
    return null;
  }
}


export async function getLicitacionesAsignadas() {
  const session = await auth();
  try {
    const licitaciones = await prisma.licitacion.findMany({
      orderBy: [{
        fechapresentacion: {
          sort: 'desc',
          nulls: 'last'
        }
      }],
      where: {
        AND: [
          {
            estadofinal: {
              equals: "ADJUDICADA",
            },
          },
        ],
      },
    })
    return licitaciones;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getLicitacionesEnPresupuesto() {
  const session = await auth();
  try {
    const licitaciones = await prisma.licitacion.findMany({
      orderBy: [{
        fechapresentacion: {
          sort: 'desc',
          nulls: 'last'
        }
      }],
      where: {
        presupuestopor: {
          endsWith: session.user.name,
        },
      },
    })
    return licitaciones;
  } catch (error) {
    // console.log(error);  
    return null;
  }
}

export async function misLicitaciones(formData) {
  const session = await auth();
  const item = Number(formData.get('item'))
  const presupuestopor = session.user.name

  try {
    const licitacion = await prisma.licitacion.update({
      where: { item },
      data: {
        presupuestopor
      },
    })
    await misLicitacionesGoogleSheet(item, presupuestopor);
    revalidatePath('/asignadas')
  } catch (error) {
    console.log(error);
  }
  redirect('/asignadas');
}

export async function deleteMiLicitacion(formData) {
  const item = Number(formData.get('item'))
  const presupuestopor = null

  try {
    const licitacion = await prisma.licitacion.update({
      where: { item },
      data: {
        presupuestopor
      },
    })
    await misLicitacionesGoogleSheet(item, presupuestopor);
    revalidatePath('/mislicitaciones')
  } catch (error) {
    console.log(error);
  }
  redirect('/mislicitaciones');
}

async function misLicitacionesGoogleSheet(item, presupuestoPor) {
  try {
    // Load credentials from JSON file

    // Create authentication client
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    // Initialize Google Sheets API
    const sheets = google.sheets({ version: 'v4', auth });

    // ID of the spreadsheet
    const spreadsheetId = '1LbA7TeXuh_LyYMLlma6o09zrqXGYUf9tvqJOV-1iyBw';

    // Find the row number corresponding to the specified item
    const range = 'Sheet1!A:AA'; // Adjust as per your spreadsheet structure
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values;
    const rowToUpdateIndex = rows.findIndex(row => Number(row[0]) === item);
    if (rowToUpdateIndex !== -1) {
      // Prepare the values to be updated in the row
      const values = rows[rowToUpdateIndex];
      const columnIndex = 9; // Index 9 corresponds to column J (presupuestopor)
      if (presupuestoPor === null) {
        // If presupuestoPor is null, remove the content of the cell
        values[columnIndex] = '';
      } else {
        // Otherwise, update the cell with the new value
        values[columnIndex] = presupuestoPor;
      }

      // Update the row in the spreadsheet
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Sheet1!A${rowToUpdateIndex + 1}:AA${rowToUpdateIndex + 1}`, // Adjust the range as per your spreadsheet structure
        valueInputOption: 'RAW',
        resource: {
          values: [values],
        },
      });
    } else {
      console.error('Row not found for item:', item);
    }
  } catch (error) {
    console.error('Error updating Google Sheet:', error);
    throw error;
  }
}

//google
//id: 1cAcgzxl_N0NG0S14astjJ7cWl-00nDBaWc4Zba6mAew
// Function to insert data into Google Spreadsheet
export async function insertIntoGoogleSheet(data) {
  try {
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1LbA7TeXuh_LyYMLlma6o09zrqXGYUf9tvqJOV-1iyBw';
    const range = 'Sheet1!A:AA';

    const values = Object.values(data); // Extract values from the data object

    // Insert data into the spreadsheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: {
        values: [values] // Wrap values in an array
      },
    });
  } catch (error) {
    console.error('Error inserting data into Google Sheet:', error);
    throw error;
  }
}



export async function newLicitacion(formData) {
  try {
    const fechapresentacion = formData.get("fechapresentacion") ? new Date(formData.get('fechapresentacion')).toISOString() : null;
    const cliente = formData.get('cliente').toUpperCase();
    const importe = Number(formData.get('importe'));
    const numexpediente = formData.get('numexpediente');
    const titulo = formData.get('titulo');
    const tipo = formData.get('tipo');
    const tipocontrato = formData.get('tipocontrato');
    const duracioncontratoanyo = formData.get('duracioncontratoanyo');
    const rutacarpeta = formData.get('rutacarpeta');
    const estadoini = formData.get('estadoini');
    const estadofinal = formData.get('estadofinal');
    const fechaformalizacion = formData.get("fechaformalizacion") ? new Date(formData.get('fechaformalizacion')).toISOString() : null;
    const observaciones = formData.get('observaciones');
    const captadapor = formData.get('captadapor');
    const estudiopor = formData.get('estudiopor');
    const presupuestopor = formData.get('presupuestopor');
    const presentadapor = formData.get('presentadapor');
    const importeanual = Number(formData.get('importeanual'));
    const fechafincontrato = formData.get('fechafincontrato') ? new Date(formData.get('fechafincontrato')).toISOString() : null;
    const prorrogas = formData.get('prorrogas');
    const prorroga1 = formData.get('prorroga1') ? new Date(formData.get('prorroga1')).toISOString() : null;
    const prorroga2 = formData.get('prorroga2') ? new Date(formData.get('prorroga2')).toISOString() : null;
    const prorroga3 = formData.get('prorroga3') ? new Date(formData.get('prorroga3')).toISOString() : null;
    const fianza = formData.get('fianza') ? Number(formData.get('fianza')) : null;
    const garantia = formData.get('garantia');
    const responsable = formData.get('responsable');

    const licitacion = await prisma.licitacion.create({
      data: {
        fechapresentacion,
        cliente,
        importe,
        numexpediente,
        titulo,
        tipo,
        tipocontrato,
        duracioncontratoanyo,
        rutacarpeta,
        estadoini,
        estadofinal,
        fechaformalizacion,
        observaciones,
        captadapor,
        estudiopor,
        presupuestopor,
        presentadapor,
        importeanual,
        fechafincontrato,
        prorrogas,
        prorroga1,
        prorroga2,
        prorroga3,
        fianza,
        garantia,
        responsable
      },
      select: {
        item: true,
        fechapresentacion: true,
        cliente: true,
        importe: true,
        numexpediente: true,
        titulo: true,
        tipo: true,
        tipocontrato: true,
        duracioncontratoanyo: true,
        rutacarpeta: true,
        estadoini: true,
        estadofinal: true,
        fechaformalizacion: true,
        observaciones: true,
        captadapor: true,
        estudiopor: true,
        presupuestopor: true,
        presentadapor: true,
        importeanual: true,
        fechafincontrato: true,
        prorrogas: true,
        prorroga1: true,
        prorroga2: true,
        prorroga3: true,
        fianza: true,
        garantia: true,
        responsable: true
      }
    });
    { console.log("item:" + licitacion.item) }
    await insertIntoGoogleSheet({
      item: licitacion.item,
      fechapresentacion: licitacion.fechapresentacion,
      cliente: licitacion.cliente,
      titulo: licitacion.titulo,
      numexpediente: licitacion.numexpediente,
      tipo: licitacion.tipo,
      tipocontrato: licitacion.tipocontrato,
      importe: licitacion.importe,
      fechaformalizacion: licitacion.fechaformalizacion,
      presupuestopor: licitacion.presupuestopor,
      presentadapor: licitacion.presentadapor,
      estadoini: licitacion.estadoini,
      estadofinal: licitacion.estadofinal,
      duracioncontratoanyo: licitacion.duracioncontratoanyo,
      observaciones: licitacion.observaciones,
      captadapor: licitacion.captadapor,
      estudiopor: licitacion.estudiopor,
      rutacarpeta: licitacion.rutacarpeta,
      importeanual: licitacion.importeanual,
      fechafincontrato: licitacion.fechafincontrato,
      prorrogas: licitacion.prorrogas,
      prorroga1: licitacion.prorroga1,
      prorroga2: licitacion.prorroga2,
      prorroga3: licitacion.prorroga3,
      fianza: licitacion.fianza,
      garantia: licitacion.garantia,
      responsable: licitacion.responsable
    });

    await newEventoLicitacion({
      fechapresentacion,
      titulo,
      tipo,
      cliente,
      estadoini,
      captadapor,
      item: licitacion.item
    })
    console.log("Creada licitacion "+ licitacion.item);
    revalidatePath('/dashboard');
    redirect('/dashboard'); // Redirect after successful creation
  } catch (error) {
    console.log(error);
    redirect('/dashboard'); // Redirect in case of error
  }
}

export async function editLicitacion(formData) {
  const item = Number(formData.get('item'));
  const fechapresentacion = formData.get("fechapresentacion") ? new Date(formData.get('fechapresentacion')).toISOString() : null;
  const cliente = formData.get('cliente');
  const importe = Number(formData.get('importe'));
  const numexpediente = formData.get('numexpediente');
  const tipo = formData.get('tipo');
  const tipocontrato = formData.get('tipocontrato');
  const duracioncontratoanyo = formData.get('duracioncontratoanyo');
  const rutacarpeta = formData.get('rutacarpeta');
  const estadoini = formData.get('estadoini');
  const estadofinal = formData.get('estadofinal');
  const fechaformalizacion = formData.get("fechaformalizacion") ? new Date(formData.get('fechaformalizacion')).toISOString() : null;
  const observaciones = formData.get('observaciones');
  const presentadapor = formData.get('presentadapor');
  const presupuestopor = formData.get('presupuestopor');
  const estudiopor = formData.get('estudiopor');
  const titulo = formData.get('titulo');
  const captadapor = formData.get('captadapor');
  const importeanual = Number(formData.get('importeanual'));
  const fechafincontrato = formData.get('fechafincontrato') ? new Date(formData.get('fechafincontrato')).toISOString() : null;
  const prorrogas = formData.get('prorrogas');
  const prorroga1 = formData.get('prorroga1') ? new Date(formData.get('prorroga1')).toISOString() : null;
  const prorroga2 = formData.get('prorroga2') ? new Date(formData.get('prorroga2')).toISOString() : null;
  const prorroga3 = formData.get('prorroga3') ? new Date(formData.get('prorroga3')).toISOString() : null;
  const fianza = formData.get('fianza') ? Number(formData.get('fianza')) : null;
  const garantia = formData.get('garantia');
  const responsable = formData.get('responsable');

  try {
    // Update the database
    const updatedLicitacion = await prisma.licitacion.update({
      where: { item },
      data: {
        fechapresentacion,
        cliente,
        importe,
        numexpediente,
        tipo,
        tipocontrato,
        duracioncontratoanyo,
        rutacarpeta,
        estadoini,
        estadofinal,
        fechaformalizacion,
        observaciones,
        presentadapor,
        estudiopor,
        presupuestopor,
        titulo,
        captadapor,
        rutacarpeta,
        importeanual,
        fechafincontrato,
        prorrogas,
        prorroga1,
        prorroga2,
        prorroga3,
        fianza,
        garantia,
        responsable
      },
    });

    // Update the Google Sheet
    await updateGoogleSheet(item, {
      fechapresentacion,
      cliente,
      titulo,
      numexpediente,
      tipo,
      tipocontrato,
      importe,
      fechaformalizacion,
      presupuestopor,
      presentadapor,
      estadoini,
      estadofinal,
      duracioncontratoanyo,
      rutacarpeta,
      observaciones,
      captadapor,
      estudiopor,
      rutacarpeta,
      importeanual,
      fechafincontrato,
      prorrogas,
      prorroga1,
      prorroga2,
      prorroga3,
      fianza,
      garantia,
      responsable
    });

    await editEventoLicitacion({
      fechapresentacion,
      titulo,
      tipo,
      cliente,
      estadoini,
      captadapor,
      item
    })
    console.log("Editada licitacion "+item);
    revalidatePath('/dashboard');
    redirect('/dashboard');
  } catch (error) {
    console.log(error);
    redirect('/dashboard');
  }
}


async function updateGoogleSheet(item, newData) {
  try {
    // Load credentials from JSON file

    // Create authentication client
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    // Initialize Google Sheets API
    const sheets = google.sheets({ version: 'v4', auth });

    // ID of the spreadsheet
    const spreadsheetId = '1LbA7TeXuh_LyYMLlma6o09zrqXGYUf9tvqJOV-1iyBw';

    // Find the row number corresponding to the specified item
    // Find the row number corresponding to the specified item
    const range = 'Sheet1!A:AA'; // Adjust as per your spreadsheet structure
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values;
    const rowToUpdate = rows.findIndex(row => Number(row[0]) === item) + 1;

    // Prepare the values to be updated in the row
    const values = [
      item, // Remove leading and trailing ' characters
      newData.fechapresentacion,
      newData.cliente,
      newData.titulo,
      newData.numexpediente,
      newData.tipo,
      newData.tipocontrato,
      newData.importe.toString(),
      newData.fechaformalizacion,
      newData.presupuestopor,
      newData.presentadapor,
      newData.estadoini,
      newData.estadofinal,
      newData.duracioncontratoanyo.toString(),
      newData.observaciones,
      newData.captadapor,
      newData.estudiopor,
      newData.rutacarpeta,
      newData.importeanual,
      newData.fechafincontrato,
      newData.prorrogas,
      newData.prorroga1,
      newData.prorroga2,
      newData.prorroga3,
      newData.fianza !== null ? newData.fianza.toString() : newData.fianza,
      newData.garantia,
      newData.responsable
    ];
    console.log(values);

    // Update the row in the spreadsheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Sheet1!A${rowToUpdate}:AA${rowToUpdate}`, // Adjust the range as per your spreadsheet structure
      valueInputOption: 'RAW',
      resource: {
        values: [values],
      },
    });
    console.log(values[0]);
  } catch (error) {
    console.error('Error updating Google Sheet:', error);
    throw error;
  }
}




export async function deleteLicitacion(formData) {
  try {
    const item = Number(formData.get('item'))

    const licitacion = await prisma.licitacion.delete({
      where: {
        item: item,
      },
    })
    await deleteFromGoogleSheet(item);
    await deleteEventoLicitacion({ item });
    revalidatePath('/dashboard')
  } catch (error) {
    console.log(error);
  }

  redirect('/dashboard');
}

async function deleteFromGoogleSheet(itemId) {
  try {
    // Load credentials from JSON file

    // Create authentication client
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    // Initialize Google Sheets API
    const sheets = google.sheets({ version: 'v4', auth });

    // ID of the spreadsheet
    const spreadsheetId = '1LbA7TeXuh_LyYMLlma6o09zrqXGYUf9tvqJOV-1iyBw';

    // Find the row number corresponding to the deleted item
    const range = `Sheet1!A:A`; // Adjust as per your spreadsheet structure
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values;
    const rowToDelete = rows.findIndex(row => Number(row[0]) === itemId) + 1;

    // Delete the row from the spreadsheet
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0,
                dimension: 'ROWS',
                startIndex: rowToDelete - 1,
                endIndex: rowToDelete,
              },
            },
          },
        ],
      },
    });
    console.log("Eliminada licitacion "+item);
  } catch (error) {
    console.error('Error deleting from Google Sheet:', error);
    throw error;
  }
}

export async function newEvento(formData) {

  try {
    const creador = formData.get('creador');
    const start = formData.get('inicio');
    console.log("inicio: " + start);
    const end = formData.get('fin');
    console.log("fin: " + end);
    const title = formData.get('descripcion');
    const categoria = formData.get('categoria');

    const evento = await prisma.evento.create({
      data: {
        creador,
        start,
        end,
        title,
        categoria,
      },
      select: {
        id: true,
        creador: true,
        start: true,
        end: true,
        title: true,
        categoria: true,
      }
    });

    revalidatePath('/calendario');
    redirect('/calendario'); // Redirect after successful creation
  } catch (error) {
    console.log(error);
    redirect('/calendario'); // Redirect in case of error
  }
}

export async function newEventoLicitacion({
  fechapresentacion,
  titulo,
  tipo,
  cliente,
  estadoini,
  captadapor,
  item }) {
  try {
    const creador = captadapor;
    const start = new Date(fechapresentacion).toISOString();
    const end = new Date(fechapresentacion).toISOString();
    const title = `${cliente} ${titulo} ${tipo}`;
    const categoria = estadoini;
    const idLicitacion = item;

    const evento = await prisma.evento.create({
      data: {
        creador,
        start,
        end,
        title,
        categoria,
        idLicitacion
      },
      select: {
        id: true,
        creador: true,
        start: true,
        end: true,
        title: true,
        categoria: true,
        idLicitacion: true
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export async function editEventoLicitacion({
  fechapresentacion,
  titulo,
  tipo,
  cliente,
  estadoini,
  captadapor,
  item }) {
  try {
    const idLicitacion = item;
    const creador = captadapor;
    const start = new Date(fechapresentacion).toISOString();
    const end = new Date(fechapresentacion).toISOString();
    const title = `${cliente} ${titulo} ${tipo}`;
    const categoria = estadoini;

    const evento = await prisma.evento.update({
      where: { idLicitacion },
      data: {
        creador,
        start,
        end,
        title,
        categoria,
        idLicitacion
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function deleteEventoLicitacion({ item }) {
  try {
    const idLicitacion = item;
    const evento = await prisma.evento.delete({
      where: { idLicitacion },
    });
  } catch (error) {
    console.log(error);
  }
}


export async function getEventos() {
  try {
    const eventos = await prisma.evento.findMany()
    //console.log(eventos);
    return eventos;
  } catch (error) {
    // console.log(error);  
    return null;
  }
}

export async function editEvento(formData) {
  const id = Number(formData.get('id'));
  const creador = formData.get('creador');
  const start = new Date(formData.get('inicio'));
  const end = new Date(formData.get('fin'));
  const title = formData.get('descripcion');
  const categoria = formData.get('categoria')
  try {
    // Update the database
    const updatedEvento = await prisma.evento.update({
      where: { id },
      data: {
        creador,
        start,
        end,
        title,
        categoria,
      },
    });
    //console.log(item);
    revalidatePath('/calendario');
    redirect('/calendario');
  } catch (error) {
    console.log(error);
    redirect('/calendario');
  }
}

export async function eliminarEvento(formData) {
  try {
    const id = Number(formData.get('id'))

    const evento = await prisma.evento.delete({
      where: {
        id: id,
      },
    })
  } catch (error) {
    console.log(error);
  }

  redirect('/calendario');
}