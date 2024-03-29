"""secret

Revision ID: bee3ed6b14e2
Revises: 91c063d2807d
Create Date: 2022-07-26 14:06:20.401669

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bee3ed6b14e2'
down_revision = '91c063d2807d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('clients', sa.Column('client_secret', sa.String(length=100), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('clients', 'client_secret')
    # ### end Alembic commands ###
