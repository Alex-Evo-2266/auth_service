"""color

Revision ID: 762da65a267a
Revises: cd19db92e5c8
Create Date: 2022-04-16 19:46:01.123922

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '762da65a267a'
down_revision = 'cd19db92e5c8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('interfacecolors',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user', sa.Integer(), nullable=True),
    sa.Column('color1', sa.String(length=8), nullable=False),
    sa.Column('color2', sa.String(length=8), nullable=False),
    sa.Column('active', sa.String(length=8), nullable=False),
    sa.ForeignKeyConstraint(['user'], ['users.id'], name='fk_interfacecolors_users_id_user'),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('users', sa.Column('color', sa.Integer(), nullable=True))
    op.add_column('users', sa.Column('nightColor', sa.Integer(), nullable=True))
    op.add_column('users', sa.Column('autoColorSwitching', sa.Boolean(), nullable=True))
    op.add_column('users', sa.Column('autoBackgroundSwitching', sa.Boolean(), nullable=True))
    op.drop_column('users', 'staticBackground')
    op.drop_column('users', 'auteStyle')
    op.drop_column('users', 'Style')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('Style', mysql.VARCHAR(length=200), nullable=True))
    op.add_column('users', sa.Column('auteStyle', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True))
    op.add_column('users', sa.Column('staticBackground', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True))
    op.drop_column('users', 'autoBackgroundSwitching')
    op.drop_column('users', 'autoColorSwitching')
    op.drop_column('users', 'nightColor')
    op.drop_column('users', 'color')
    op.drop_table('interfacecolors')
    # ### end Alembic commands ###
