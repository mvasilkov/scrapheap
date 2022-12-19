from pathlib import Path

from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

OUR_ROOT = Path(__file__).parents[1]
DATABASE_URL = 'sqlite:///' + str(OUR_ROOT / 'db.sqlite')

engine = create_engine(DATABASE_URL)

Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Post(Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String)
    picture = Column(String)

    def __repr__(self):
        return '<Post(title={}, picture={})>'.format(self.title, self.picture)
