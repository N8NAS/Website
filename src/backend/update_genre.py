from sqlalchemy import text
from app.core.database import engine

with engine.connect() as con:
    try:
        con.execute(text("ALTER TABLE movies ADD COLUMN genre VARCHAR(100) DEFAULT 'Uncategorized'"))
        con.execute(text("ALTER TABLE tv_shows ADD COLUMN genre VARCHAR(100) DEFAULT 'Uncategorized'"))
        con.commit()
        print("✅ BERHASIL: Kolom 'genre' telah ditambahkan ke tabel Movies & TV Shows!")
    except Exception as e:
        print("❌ GAGAL / SUDAH ADA:", e)
