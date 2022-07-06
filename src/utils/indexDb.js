let db;

//start
export function startDb() {
  return new Promise((resolve, reject) => {
    let dbConnection = indexedDB.open("DevBlog", 1);

    dbConnection.onsuccess = (e) => {
      db = e.target.result;
      //   console.log("IndexedDB is connected");
      resolve();
    };

    dbConnection.onupgradeneeded = (e) => {
      db = e.target.result;

      let objectStore = db.createObjectStore("blogs", {
        keyPath: "page",
        autoIncrement: true,
      });

      console.log(objectStore);
    };

    dbConnection.onerror = (e) => {
      reject(e);
    };
    // resolve(db, "startDb");
  });
}

export function addBlog(page, blog) {
  //   startDb();
  let transaction = db?.transaction(["blogs"], "readwrite");
  let store = transaction.objectStore("blogs");
  store.add({ page, blog });
}

//getDataFromIndexDb
export async function getDataFromIndexDb(page) {
  //   startDb().then(() => {
  // console.log(db, "db");
  let store = db?.transaction(["blogs"]).objectStore("blogs");
  let request = store?.get(page);

  //   request.onsuccess = (e) => {
  //     console.log(e.target.result, "e.target.result");
  //     return e.target.result;
  //   };

  return new Promise((resolve, reject) => {
    request.onsuccess = (e) => {
      //   console.log(e.target.result, "e.target.result");
      resolve(e.target.result);
    };

    request.onerror = (e) => {
      reject(e);
    };
  });
  //   });
}
