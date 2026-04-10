#!/bin/bash

# ============================================================
# Database Seed Script
# ============================================================
# Script untuk populate database dengan data awal
# Berguna agar semua anggota tim punya data yang sama
# ============================================================

set -e

echo "🌱 Seeding database..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 3

# Seed users
echo "👤 Creating users..."
docker exec db psql -U postgres -d cloudapp <<-EOSQL
    -- Clear existing data (optional)
    TRUNCATE TABLE items, users CASCADE;

    -- Insert sample users
    INSERT INTO users (email, name, hashed_password, is_active, created_at) VALUES
    ('admin@test.com', 'Admin User', '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJfLKZZRi', true, NOW()),
    ('user1@test.com', 'User One', '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJfLKZZRi', true, NOW()),
    ('user2@test.com', 'User Two', '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJfLKZZRi', true, NOW());
EOSQL

# Seed items
echo "📦 Creating items..."
docker exec db psql -U postgres -d cloudapp <<-EOSQL
    -- Insert sample items
    INSERT INTO items (name, description, price, quantity, created_at) VALUES
    ('Laptop', 'MacBook Pro 16 inch', 25000000, 5, NOW()),
    ('Mouse', 'Logitech MX Master 3', 1500000, 10, NOW()),
    ('Keyboard', 'Keychron K2', 1200000, 8, NOW()),
    ('Monitor', 'LG UltraWide 34 inch', 8000000, 3, NOW()),
    ('Headphone', 'Sony WH-1000XM5', 4500000, 6, NOW());
EOSQL

echo "✅ Database seeded successfully!"
echo ""
echo "📝 Sample credentials:"
echo "  Email: admin@test.com"
echo "  Password: password123!"
echo ""
echo "  Email: user1@test.com"
echo "  Password: password123!"
