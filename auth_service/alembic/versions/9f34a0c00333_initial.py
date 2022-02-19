"""initial

Revision ID: 9f34a0c00333
Revises: 7be88eeea244
Create Date: 2022-02-19 22:02:21.259844

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9f34a0c00333'
down_revision = '7be88eeea244'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=200), nullable=False),
    sa.Column('surname', sa.String(length=200), nullable=True),
    sa.Column('password', sa.String(length=200), nullable=False),
    sa.Column('email', sa.String(length=200), nullable=False),
    sa.Column('level', sa.Integer(), nullable=True),
    sa.Column('Style', sa.String(length=200), nullable=True),
    sa.Column('auteStyle', sa.Boolean(), nullable=True),
    sa.Column('staticBackground', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('imagebackgrounds',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('type', sa.String(length=200), nullable=True),
    sa.Column('title', sa.String(length=200), nullable=False),
    sa.Column('image', sa.String(length=1000), nullable=False),
    sa.Column('user', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user'], ['users.id'], name='fk_imagebackgrounds_users_id_user'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('imagebackgrounds')
    op.drop_table('users')
    # ### end Alembic commands ###
