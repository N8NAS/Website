import sqlalchemy
from sqlalchemy import create_engine, text

engine = create_engine('mysql+pymysql://root:Nathan37ImOut@localhost:3306/sanflix')

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';"))
        print("Kolom 'role' berhasil ditambahkan ke tabel users!")
    except Exception as e:
        print("Kolom 'role' mungkin sudah ada:", e)

    conn.execute(text("UPDATE users SET role = 'admin' WHERE email = 'nathan.santosa37@gmail.com';"))
    conn.commit()
    print("Akun nathan.santosa37@gmail.com berhasil diangkat menjadi Admin Utama!")
