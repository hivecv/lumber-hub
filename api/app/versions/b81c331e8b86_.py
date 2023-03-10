"""empty message

Revision ID: b81c331e8b86
Revises: 2c073659010f
Create Date: 2023-02-25 15:23:43.812426

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b81c331e8b86'
down_revision = '2c073659010f'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('devices', sa.Column('device_uuid', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('devices', 'device_uuid')
    # ### end Alembic commands ###
