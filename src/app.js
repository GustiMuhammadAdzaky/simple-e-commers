document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      {
        id: 1,
        name: "Robusta Brazil",
        img: "1.jpg",
        price: 20000,
      },
      {
        id: 2,
        name: "Primo Passo",
        img: "2.jpg",
        price: 30000,
      },
      {
        id: 3,
        name: "Caffeina",
        img: "3.jpg",
        price: 15000,
      },
      {
        id: 4,
        name: "Aceh Gayo",
        img: "4.jpg",
        price: 25000,
      },
      {
        id: 5,
        name: "Mexico Coffe",
        img: "5.jpg",
        price: 22000,
      },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah ada barang yang sama di cart
      const cartItem = this.items.find((item) => item.id == newItem.id);

      // jika belum ada/ cart kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // jika sudah ada
        this.items = this.items.map((item) => {
          if (item.id !== newItem.id) {
            return item;
          } else {
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
      console.log(this.total);
    },
    remove(id) {
      // ambil yang mau diremove berdasarkan id
      const cartItem = this.items.find((item) => item.id === id);

      // jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // telursuri satu satu
        this.items = this.items.map((item) => {
          // jika bukan barang yang di kilk
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// form validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;
const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[1].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }

  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

// Kirim data ketika tombol checkout ditekan
// checkoutButton.addEventListener("click", async function (e) {
//   e.preventDefault();
//   const formData = new FormData(form);
//   const data = new URLSearchParams(formData);
//   const objData = Object.fromEntries(data);
//   // const message = formatMessage(objData);
//   // window.open("http://wa.me/6289691789422?text=" + encodeURIComponent(message));
//   // console.log(objData);

//   try {
//     const response = await fetch("php/placeOrder.php", {
//       method: "post",
//       body: data,
//     });
//     const token = await response.text();
//     console.log(token);
//   } catch (err) {
//     console.log(err.message);
//   }

//   // window.snap.pay(token);
// });

// checkoutButton.addEventListener("click", async function (e) {
//   e.preventDefault();
//   console.log("Button clicked");
//   const formData = new FormData(form);
//   const data = new URLSearchParams(formData);
//   const objData = Object.fromEntries(data);
//   // console.log(objData); // Check if formData is correct

//   try {
//     const response = await fetch("php/placeOrder.php", {
//       method: "post",
//       body: data,
//     });
//     const token = await response.text();
//     console.log("Token:", token); // Check if token is received
//     // window.snap.pay(token);
//   } catch (err) {
//     console.log("Error:", err.message);
//   }
// });

checkoutButton.addEventListener("click", async function (e) {
  e.preventDefault();
  console.log("Button clicked");
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);

  try {
    const response = await fetch("php/placeOrder.php", {
      method: "post",
      body: data,
    });

    if (response.ok) {
      const token = await response.text();
      // console.log("Token:", token); // Check if token is received
      window.snap.pay(token);
    } else {
      console.error("Failed to retrieve Snap Token");
    }
  } catch (err) {
    console.log("Error:", err.message);
  }
});

// format pesan data
const formatMessage = (obj) => {
  return `Data Customer
    Nama: ${obj.nama}
    Email : ${obj.email}
    No Hp : ${obj.phone}
  Data Pesanan
  ${JSON.parse(obj.items).map(
    (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
  )}
  Total: ${rupiah(obj.total)}
  Terimakasih`;
};

const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
