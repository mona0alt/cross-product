import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { env } from '../src/lib/env';

const prisma = new PrismaClient();

type CategorySeed = {
  slug: string;
  iconImageUrl: string;
  names: {
    zh: string;
    en: string;
    es: string;
    pt: string;
  };
  descriptions: {
    zh: string;
    en: string;
    es: string;
    pt: string;
  };
  children: Array<{
    slug: string;
    iconImageUrl: string;
    names: CategorySeed['names'];
    descriptions: CategorySeed['descriptions'];
  }>;
};

async function main() {
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);

  await prisma.$transaction(async (tx) => {
    await tx.productImage.deleteMany();
    await tx.product.deleteMany();
    await tx.banner.deleteMany();
    await tx.message.deleteMany();
    await tx.subscriber.deleteMany();
    await tx.category.deleteMany();
    await tx.admin.deleteMany();

    await tx.admin.create({
      data: {
        username: env.ADMIN_USERNAME,
        passwordHash
      }
    });

    const catalog: CategorySeed[] = [
      {
        slug: 'electronics',
        iconImageUrl: 'https://images.example.com/categories/electronics.png',
        names: {
          zh: '电子数码',
          en: 'Electronics',
          es: 'Electrónica',
          pt: 'Eletrônicos'
        },
        descriptions: {
          zh: '围绕智能设备和办公效率的演示分类。',
          en: 'Demo category for smart devices and productivity.',
          es: 'Categoría de demostración para dispositivos inteligentes y productividad.',
          pt: 'Categoria de demonstração para dispositivos inteligentes e produtividade.'
        },
        children: [
          {
            slug: 'electronics-phones',
            iconImageUrl: 'https://images.example.com/categories/phones.png',
            names: {
              zh: '手机',
              en: 'Phones',
              es: 'Teléfonos',
              pt: 'Celulares'
            },
            descriptions: {
              zh: '展示旗舰和入门机型。',
              en: 'Showcases flagship and entry devices.',
              es: 'Muestra dispositivos insignia y de entrada.',
              pt: 'Mostra dispositivos premium e de entrada.'
            }
          },
          {
            slug: 'electronics-computers',
            iconImageUrl: 'https://images.example.com/categories/computers.png',
            names: {
              zh: '电脑',
              en: 'Computers',
              es: 'Computadoras',
              pt: 'Computadores'
            },
            descriptions: {
              zh: '适合内容创作与办公。',
              en: 'Suitable for content creation and work.',
              es: 'Adecuado para creación de contenido y trabajo.',
              pt: 'Adequado para criação de conteúdo e trabalho.'
            }
          }
        ]
      },
      {
        slug: 'home-living',
        iconImageUrl: 'https://images.example.com/categories/home-living.png',
        names: {
          zh: '居家生活',
          en: 'Home Living',
          es: 'Hogar',
          pt: 'Casa e Vida'
        },
        descriptions: {
          zh: '展示日常生活与家居用品。',
          en: 'Demo category for daily living and home goods.',
          es: 'Categoría de demostración para vida diaria y hogar.',
          pt: 'Categoria de demonstração para vida diária e casa.'
        },
        children: [
          {
            slug: 'home-living-storage',
            iconImageUrl: 'https://images.example.com/categories/storage.png',
            names: {
              zh: '收纳',
              en: 'Storage',
              es: 'Almacenamiento',
              pt: 'Armazenamento'
            },
            descriptions: {
              zh: '整理空间的高频收纳方案。',
              en: 'Storage solutions for organizing space.',
              es: 'Soluciones de almacenamiento para organizar el espacio.',
              pt: 'Soluções de armazenamento para organizar o espaço.'
            }
          },
          {
            slug: 'home-living-kitchen',
            iconImageUrl: 'https://images.example.com/categories/kitchen.png',
            names: {
              zh: '厨房',
              en: 'Kitchen',
              es: 'Cocina',
              pt: 'Cozinha'
            },
            descriptions: {
              zh: '烹饪与餐厨用品展示。',
              en: 'Demo area for cooking and kitchen goods.',
              es: 'Área de demostración para cocina y utensilios.',
              pt: 'Área de demonstração para cozinha e utensílios.'
            }
          }
        ]
      }
    ];

    const categories = new Map<string, string>();

    for (const group of catalog) {
      const parent = await tx.category.create({
        data: {
          slug: group.slug,
          iconImageUrl: group.iconImageUrl,
          isActive: true,
          sortOrder: 0,
          nameZh: group.names.zh,
          nameEn: group.names.en,
          nameEs: group.names.es,
          namePt: group.names.pt,
          descriptionZh: group.descriptions.zh,
          descriptionEn: group.descriptions.en,
          descriptionEs: group.descriptions.es,
          descriptionPt: group.descriptions.pt
        }
      });
      categories.set(group.slug, parent.id);

      for (const child of group.children) {
        const created = await tx.category.create({
          data: {
            parentId: parent.id,
            slug: child.slug,
            iconImageUrl: child.iconImageUrl,
            isActive: true,
            sortOrder: 0,
            nameZh: child.names.zh,
            nameEn: child.names.en,
            nameEs: child.names.es,
            namePt: child.names.pt,
            descriptionZh: child.descriptions.zh,
            descriptionEn: child.descriptions.en,
            descriptionEs: child.descriptions.es,
            descriptionPt: child.descriptions.pt
          }
        });
        categories.set(child.slug, created.id);
      }
    }

    const products = [
      {
        slug: 'star-river-pro-phone',
        productCode: 'P-1001',
        categorySlug: 'electronics-phones',
        priceUsd: new Prisma.Decimal('699.00'),
        coverImageUrl: 'https://images.example.com/products/phone-cover.jpg',
        isRecommended: true,
        sortOrder: 1,
        publishedAt: new Date('2026-04-29T00:00:00.000Z'),
        names: {
          zh: '星河 Pro 手机',
          en: 'Star River Pro Phone',
          es: 'Teléfono Star River Pro',
          pt: 'Telefone Star River Pro'
        },
        intros: {
          zh: '轻薄旗舰，日常创作更高效。',
          en: 'A slim flagship for productive everyday work.',
          es: 'Un modelo insignia liviano para el trabajo diario.',
          pt: 'Um topo de linha leve para o dia a dia produtivo.'
        },
        details: {
          zh: '面向内容创作者的高性能演示机型，提供流畅体验和清晰影像。',
          en: 'High-performance demo phone for creators with smooth performance and clear imaging.',
          es: 'Teléfono de demostración de alto rendimiento para creadores, con fluidez e imagen clara.',
          pt: 'Celular de demonstração de alto desempenho para criadores, com fluidez e imagem nítida.'
        }
      },
      {
        slug: 'cloudscape-laptop',
        productCode: 'P-1002',
        categorySlug: 'electronics-computers',
        priceUsd: new Prisma.Decimal('999.00'),
        coverImageUrl: 'https://images.example.com/products/laptop-cover.jpg',
        isRecommended: true,
        sortOrder: 2,
        publishedAt: new Date('2026-04-29T00:00:00.000Z'),
        names: {
          zh: '云境轻薄本',
          en: 'Cloudscape Laptop',
          es: 'Portátil Cloudscape',
          pt: 'Notebook Cloudscape'
        },
        intros: {
          zh: '移动办公与创作的主力选择。',
          en: 'The main choice for mobile work and creation.',
          es: 'La opción principal para trabajo móvil y creación.',
          pt: 'A escolha principal para trabalho móvel e criação.'
        },
        details: {
          zh: '适合办公、学习和轻度创作的演示笔记本，强调便携和续航。',
          en: 'A demo laptop for work, study, and light creation with portability and battery life.',
          es: 'Portátil de demostración para trabajo, estudio y creación ligera con portabilidad y batería.',
          pt: 'Notebook de demonstração para trabalho, estudo e criação leve com portabilidade e bateria.'
        }
      },
      {
        slug: 'storage-drawer-cabinet',
        productCode: 'P-2001',
        categorySlug: 'home-living-storage',
        priceUsd: new Prisma.Decimal('129.00'),
        coverImageUrl: 'https://images.example.com/products/storage-cover.jpg',
        isRecommended: false,
        sortOrder: 3,
        publishedAt: new Date('2026-04-29T00:00:00.000Z'),
        names: {
          zh: '收纳灵感抽屉柜',
          en: 'Storage Drawer Cabinet',
          es: 'Gabinete de Cajones',
          pt: 'Armário com Gavetas'
        },
        intros: {
          zh: '把空间还给生活。',
          en: 'Return space to daily living.',
          es: 'Devuelve el espacio a la vida diaria.',
          pt: 'Devolve espaço à vida diária.'
        },
        details: {
          zh: '适合客厅与卧室的多层收纳演示商品，结构轻巧而实用。',
          en: 'A multi-layer storage demo product for living rooms and bedrooms.',
          es: 'Un producto de demostración de almacenamiento multicapa para sala y dormitorio.',
          pt: 'Um produto de demonstração de armazenamento multicamadas para sala e quarto.'
        }
      },
      {
        slug: 'sunrise-cooking-pan',
        productCode: 'P-2002',
        categorySlug: 'home-living-kitchen',
        priceUsd: new Prisma.Decimal('49.00'),
        coverImageUrl: 'https://images.example.com/products/pan-cover.jpg',
        isRecommended: false,
        sortOrder: 4,
        publishedAt: new Date('2026-04-29T00:00:00.000Z'),
        names: {
          zh: '晨光多功能炒锅',
          en: 'Sunrise Multi-purpose Pan',
          es: 'Sartén Multiusos Sunrise',
          pt: 'Panela Multiuso Sunrise'
        },
        intros: {
          zh: '厨房里的高频主角。',
          en: 'A frequent star in the kitchen.',
          es: 'Una pieza estrella en la cocina.',
          pt: 'Uma peça frequente na cozinha.'
        },
        details: {
          zh: '适合日常烹饪的轻量化演示厨具，兼顾导热与易清洁。',
          en: 'A lightweight demo kitchen tool for everyday cooking and easy cleaning.',
          es: 'Un utensilio de cocina de demostración, ligero y fácil de limpiar.',
          pt: 'Um utensílio de cozinha leve para o dia a dia e fácil limpeza.'
        }
      }
    ];

    const createdProducts = new Map<string, string>();

    for (const product of products) {
      const created = await tx.product.create({
        data: {
          categoryId: categories.get(product.categorySlug)!,
          slug: product.slug,
          productCode: product.productCode,
          priceUsd: product.priceUsd,
          coverImageUrl: product.coverImageUrl,
          status: 'published',
          isRecommended: product.isRecommended,
          sortOrder: product.sortOrder,
          publishedAt: product.publishedAt,
          nameZh: product.names.zh,
          nameEn: product.names.en,
          nameEs: product.names.es,
          namePt: product.names.pt,
          introZh: product.intros.zh,
          introEn: product.intros.en,
          introEs: product.intros.es,
          introPt: product.intros.pt,
          detailZh: product.details.zh,
          detailEn: product.details.en,
          detailEs: product.details.es,
          detailPt: product.details.pt
        }
      });
      createdProducts.set(product.slug, created.id);

      await tx.productImage.createMany({
        data: [
          {
            productId: created.id,
            imageUrl: `${product.coverImageUrl}?view=1`,
            altText: product.names.zh,
            sortOrder: 0
          },
          {
            productId: created.id,
            imageUrl: `${product.coverImageUrl}?view=2`,
            altText: product.names.en,
            sortOrder: 1
          }
        ]
      });
    }

    await tx.banner.createMany({
      data: [
        {
          imageUrl: 'https://images.example.com/banners/electronics.jpg',
          targetType: 'category',
          targetId: categories.get('electronics'),
          targetUrl: null,
          sortOrder: 1,
          isActive: true
        },
        {
          imageUrl: 'https://images.example.com/banners/phone.jpg',
          targetType: 'product',
          targetId: createdProducts.get('star-river-pro-phone'),
          targetUrl: null,
          sortOrder: 2,
          isActive: true
        }
      ]
    });
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
