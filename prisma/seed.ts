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
        slug: 'window-cleaning-robots',
        iconImageUrl:
          'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop',
        names: {
          zh: '擦窗机器人',
          en: 'Window Cleaning Robots',
          es: 'Robots Limpiacristales',
          pt: 'Robôs de Limpeza de Vidros'
        },
        descriptions: {
          zh: '高效智能的窗户清洁解决方案。',
          en: 'Efficient and intelligent window cleaning solutions.',
          es: 'Soluciones de limpieza de ventanas eficientes e inteligentes.',
          pt: 'Soluções de limpeza de vidros eficientes e inteligentes.'
        },
        children: [
          {
            slug: 'residential-window-robots',
            iconImageUrl: '/show/robot_window_cleaner.png',
            names: {
              zh: '家用擦窗机器人',
              en: 'Residential',
              es: 'Residencial',
              pt: 'Residencial'
            },
            descriptions: {
              zh: '专为家庭窗户设计的智能清洁机器人。',
              en: 'Smart cleaning robots designed for home windows.',
              es: 'Robots de limpieza inteligentes diseñados para ventanas del hogar.',
              pt: 'Robôs de limpeza inteligentes projetados para janelas residenciais.'
            }
          },
          {
            slug: 'commercial-window-robots',
            iconImageUrl:
              'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=200&fit=crop',
            names: {
              zh: '商用擦窗机器人',
              en: 'Commercial',
              es: 'Comercial',
              pt: 'Comercial'
            },
            descriptions: {
              zh: '适用于高层建筑与商业场景的专业设备。',
              en: 'Professional equipment for high-rise and commercial use.',
              es: 'Equipo profesional para uso en altura y comercial.',
              pt: 'Equipamento profissional para uso em altura e comercial.'
            }
          }
        ]
      },
      {
        slug: 'drones',
        iconImageUrl:
          'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=200&h=200&fit=crop',
        names: {
          zh: '无人机',
          en: 'Drones',
          es: 'Drones',
          pt: 'Drones'
        },
        descriptions: {
          zh: '消费级与工业级无人机。',
          en: 'Consumer and industrial drones.',
          es: 'Drones de consumo e industriales.',
          pt: 'Drones de consumo e industriais.'
        },
        children: [
          {
            slug: 'consumer-drones',
            iconImageUrl:
              'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=200&h=200&fit=crop',
            names: {
              zh: '消费级无人机',
              en: 'Consumer Drones',
              es: 'Drones de Consumo',
              pt: 'Drones de Consumo'
            },
            descriptions: {
              zh: '航拍与娱乐飞行设备。',
              en: 'Aerial photography and recreational flight devices.',
              es: 'Dispositivos de fotografía aérea y vuelo recreativo.',
              pt: 'Dispositivos de fotografia aérea e voo recreativo.'
            }
          },
          {
            slug: 'industrial-drones',
            iconImageUrl:
              'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=200&h=200&fit=crop',
            names: {
              zh: '工业级无人机',
              en: 'Industrial Drones',
              es: 'Drones Industriales',
              pt: 'Drones Industriais'
            },
            descriptions: {
              zh: '测绘、巡检与物流应用的工业无人机。',
              en: 'Industrial drones for surveying, inspection and logistics.',
              es: 'Drones industriales para topografía, inspección y logística.',
              pt: 'Drones industriais para levantamento topográfico, inspeção e logística.'
            }
          }
        ]
      },
      {
        slug: 'humanoid-robots',
        iconImageUrl:
          'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200&fit=crop',
        names: {
          zh: '人形机器人',
          en: 'Humanoid Robots',
          es: 'Robots Humanoides',
          pt: 'Robôs Humanoides'
        },
        descriptions: {
          zh: '面向服务、研究与教育的人形机器人平台。',
          en: 'Humanoid robot platforms for service, research and education.',
          es: 'Plataformas de robots humanoides para servicio, investigación y educación.',
          pt: 'Plataformas de robôs humanoides para serviço, pesquisa e educação.'
        },
        children: [
          {
            slug: 'service-humanoids',
            iconImageUrl:
              'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=200&h=200&fit=crop',
            names: {
              zh: '服务人形机器人',
              en: 'Service Humanoids',
              es: 'Humanoides de Servicio',
              pt: 'Humanoides de Serviço'
            },
            descriptions: {
              zh: '迎宾、导览与家庭服务人形机器人。',
              en: 'Reception, guide and home service humanoid robots.',
              es: 'Robots humanoides de recepción, guía y servicio doméstico.',
              pt: 'Robôs humanoides de recepção, guia e serviço doméstico.'
            }
          },
          {
            slug: 'research-humanoids',
            iconImageUrl: '/show/robot_humanoid.png',
            names: {
              zh: '研究/教育人形机器人',
              en: 'Research & Education',
              es: 'Investigación y Educación',
              pt: 'Pesquisa e Educação'
            },
            descriptions: {
              zh: '面向高校与科研机构的开发人形机器人。',
              en: 'Development humanoid robots for universities and research institutes.',
              es: 'Robots humanoides de desarrollo para universidades e institutos de investigación.',
              pt: 'Robôs humanoides de desenvolvimento para universidades e institutos de pesquisa.'
            }
          }
        ]
      },
      {
        slug: 'vacuum-robots',
        iconImageUrl:
          'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=200&h=200&fit=crop',
        names: {
          zh: '扫地机器人',
          en: 'Vacuum Robots',
          es: 'Robots Aspiradores',
          pt: 'Robôs Aspiradores'
        },
        descriptions: {
          zh: '智能扫地与扫拖一体机器人。',
          en: 'Smart vacuum and vacuum-mop combo robots.',
          es: 'Robots aspiradores inteligentes y combos aspiradora-fregona.',
          pt: 'Robôs aspiradores inteligentes e combos aspirador-esfregão.'
        },
        children: [
          {
            slug: 'robot-vacuums',
            iconImageUrl: '/show/robot_floor_cleaner.png',
            names: {
              zh: '扫地机器人',
              en: 'Robot Vacuums',
              es: 'Aspiradoras Robóticas',
              pt: 'Aspiradores Robóticos'
            },
            descriptions: {
              zh: '专注高效吸尘的智能扫地机。',
              en: 'Smart robot vacuums focused on efficient suction.',
              es: 'Aspiradoras robóticas inteligentes enfocadas en succión eficiente.',
              pt: 'Aspiradores robóticos inteligentes focados em sucção eficiente.'
            }
          },
          {
            slug: 'robot-mops',
            iconImageUrl:
              'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop',
            names: {
              zh: '扫拖一体机',
              en: 'Vacuum-Mop Combos',
              es: 'Combos Aspiradora-Fregona',
              pt: 'Combos Aspirador-Esfregão'
            },
            descriptions: {
              zh: '先扫后拖，一步到位。',
              en: 'Sweep and mop in one go.',
              es: 'Barre y friega en un solo paso.',
              pt: 'Varre e esfrega em um único passo.'
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
        slug: 'sky-cleaner-pro',
        productCode: 'P-1001',
        categorySlug: 'residential-window-robots',
        priceUsd: new Prisma.Decimal('599.00'),
        coverImageUrl:
          'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&fit=crop',
        isRecommended: true,
        sortOrder: 1,
        publishedAt: new Date('2026-04-29T00:00:00.000Z'),
        names: {
          zh: 'Sky Cleaner Pro 擦窗机器人',
          en: 'Sky Cleaner Pro',
          es: 'Sky Cleaner Pro',
          pt: 'Sky Cleaner Pro'
        },
        intros: {
          zh: '家用智能擦窗，安全高效。',
          en: 'Smart home window cleaning, safe and efficient.',
          es: 'Limpieza inteligente de ventanas para el hogar, segura y eficiente.',
          pt: 'Limpeza inteligente de janelas residenciais, segura e eficiente.'
        },
        details: {
          zh: '搭载强力吸附系统与智能路径规划，专为家庭窗户设计的高性能擦窗机器人。',
          en: 'High-performance window cleaning robot with powerful suction and intelligent path planning, designed for home windows.',
          es: 'Robot limpiacristales de alto rendimiento con succión potente y planificación de rutas inteligente, diseñado para ventanas del hogar.',
          pt: 'Robô de limpeza de vidros de alto desempenho com sucção potente e planejamento de rotas inteligente, projetado para janelas residenciais.'
        }
      },
      {
        slug: 'clear-glass-max',
        productCode: 'P-1002',
        categorySlug: 'commercial-window-robots',
        priceUsd: new Prisma.Decimal('1299.00'),
        coverImageUrl:
          'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&fit=crop',
        isRecommended: true,
        sortOrder: 2,
        publishedAt: new Date('2026-04-29T00:00:00.000Z'),
        names: {
          zh: 'ClearGlass Max 商用擦窗机',
          en: 'ClearGlass Max',
          es: 'ClearGlass Max',
          pt: 'ClearGlass Max'
        },
        intros: {
          zh: '高层幕墙清洁专家。',
          en: 'Expert in high-rise facade cleaning.',
          es: 'Experto en limpieza de fachadas de gran altura.',
          pt: 'Especialista em limpeza de fachadas de arranha-céus.'
        },
        details: {
          zh: '商用级擦窗机器人，适用于高层建筑与大面积玻璃幕墙，具备防风防坠安全系统。',
          en: 'Commercial-grade window cleaning robot for high-rise buildings and large glass facades, with windproof and anti-fall safety systems.',
          es: 'Robot limpiacristales de grado comercial para edificios de gran altura y grandes fachadas de vidrio, con sistemas de seguridad anticaída y a prueba de viento.',
          pt: 'Robô de limpeza de vidros comercial para arranha-céus e grandes fachadas de vidro, com sistemas de segurança anticapotamento e à prova de vento.'
        }
      },
      {
        slug: 'aerial-x1',
        productCode: 'P-2001',
        categorySlug: 'consumer-drones',
        priceUsd: new Prisma.Decimal('799.00'),
        coverImageUrl:
          'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&fit=crop',
        isRecommended: true,
        sortOrder: 3,
        publishedAt: new Date('2026-04-29T00:00:00.000Z'),
        names: {
          zh: 'Aerial X1 航拍无人机',
          en: 'Aerial X1',
          es: 'Aerial X1',
          pt: 'Aerial X1'
        },
        intros: {
          zh: '4K航拍，轻巧随行。',
          en: '4K aerial filming, light and portable.',
          es: 'Filmación aérea 4K, ligero y portátil.',
          pt: 'Filmagem aérea 4K, leve e portátil.'
        },
        details: {
          zh: '消费级航拍无人机，支持4K视频录制与智能跟随，续航长达35分钟。',
          en: 'Consumer aerial drone supporting 4K video recording and intelligent tracking, with up to 35 minutes of flight time.',
          es: 'Drone aéreo de consumo con soporte para grabación de video 4K y seguimiento inteligente, con hasta 35 minutos de tiempo de vuelo.',
          pt: 'Drone aéreo de consumo com suporte para gravação de vídeo 4K e rastreamento inteligente, com até 35 minutos de tempo de voo.'
        }
      },
      {
        slug: 'survey-drone-t20',
        productCode: 'P-2002',
        categorySlug: 'industrial-drones',
        priceUsd: new Prisma.Decimal('3999.00'),
        coverImageUrl:
          'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&fit=crop',
        isRecommended: true,
        sortOrder: 4,
        publishedAt: new Date('2026-04-29T00:00:00.000Z'),
        names: {
          zh: 'SurveyDrone T20 工业无人机',
          en: 'SurveyDrone T20',
          es: 'SurveyDrone T20',
          pt: 'SurveyDrone T20'
        },
        intros: {
          zh: '测绘巡检，精准可靠。',
          en: 'Surveying and inspection, precise and reliable.',
          es: 'Topografía e inspección, precisos y confiables.',
          pt: 'Levantamento topográfico e inspeção, precisos e confiáveis.'
        },
        details: {
          zh: '工业级测绘与巡检无人机，配备高精度RTK定位与多光谱传感器。',
          en: 'Industrial surveying and inspection drone with high-precision RTK positioning and multispectral sensors.',
          es: 'Drone industrial de topografía e inspección con posicionamiento RTK de alta precisión y sensores multiespectrales.',
          pt: 'Drone industrial de levantamento topográfico e inspeção com posicionamento RTK de alta precisão e sensores multiespectrais.'
        }
      },
      {
        slug: 'alpha-humanoid',
        productCode: 'P-3001',
        categorySlug: 'service-humanoids',
        priceUsd: new Prisma.Decimal('29999.00'),
        coverImageUrl:
          'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&fit=crop',
        isRecommended: true,
        sortOrder: 5,
        publishedAt: new Date('2026-04-29T00:00:00.000Z'),
        names: {
          zh: 'Alpha Humanoid 服务机器人',
          en: 'Alpha Humanoid',
          es: 'Alpha Humanoid',
          pt: 'Alpha Humanoid'
        },
        intros: {
          zh: '类人智能，服务未来。',
          en: 'Human-like intelligence, serving the future.',
          es: 'Inteligencia similar a la humana, sirviendo el futuro.',
          pt: 'Inteligência semelhante à humana, servindo o futuro.'
        },
        details: {
          zh: '全尺寸双足人形机器人，具备自然语言交互与多场景服务能力。',
          en: 'Full-size bipedal humanoid robot with natural language interaction and multi-scenario service capabilities.',
          es: 'Robot humanoide bípedo de tamaño completo con interacción en lenguaje natural y capacidades de servicio multi-escenario.',
          pt: 'Robô humanoide bípede em tamanho real com interação em linguagem natural e capacidades de serviço multi-cenário.'
        }
      },
      {
        slug: 'edu-bot-mini',
        productCode: 'P-3002',
        categorySlug: 'research-humanoids',
        priceUsd: new Prisma.Decimal('4999.00'),
        coverImageUrl:
          'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&fit=crop',
        isRecommended: false,
        sortOrder: 6,
        publishedAt: new Date('2026-04-29T00:00:00.000Z'),
        names: {
          zh: 'EduBot Mini 教育机器人',
          en: 'EduBot Mini',
          es: 'EduBot Mini',
          pt: 'EduBot Mini'
        },
        intros: {
          zh: '开源平台，科研教学利器。',
          en: 'Open-source platform, ideal for research and teaching.',
          es: 'Plataforma de código abierto, ideal para investigación y enseñanza.',
          pt: 'Plataforma de código aberto, ideal para pesquisa e ensino.'
        },
        details: {
          zh: '紧凑型人形机器人开发平台，支持ROS2与Python编程，适用于高校实验室与AI教育。',
          en: 'Compact humanoid robot development platform supporting ROS2 and Python programming, ideal for university labs and AI education.',
          es: 'Plataforma de desarrollo de robots humanoides compactos con soporte para ROS2 y programación en Python, ideal para laboratorios universitarios y educación en IA.',
          pt: 'Plataforma de desenvolvimento de robôs humanoides compactos com suporte para ROS2 e programação em Python, ideal para laboratórios universitários e educação em IA.'
        }
      },
      {
        slug: 'sweep-master-s8',
        productCode: 'P-4001',
        categorySlug: 'robot-vacuums',
        priceUsd: new Prisma.Decimal('499.00'),
        coverImageUrl:
          'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=800&fit=crop',
        isRecommended: false,
        sortOrder: 7,
        publishedAt: new Date('2026-04-29T00:00:00.000Z'),
        names: {
          zh: 'SweepMaster S8 扫地机器人',
          en: 'SweepMaster S8',
          es: 'SweepMaster S8',
          pt: 'SweepMaster S8'
        },
        intros: {
          zh: '强力吸尘，智能避障。',
          en: 'Powerful suction, intelligent obstacle avoidance.',
          es: 'Succión potente, evasión inteligente de obstáculos.',
          pt: 'Sucção potente, desvio inteligente de obstáculos.'
        },
        details: {
          zh: '搭载LDS激光导航与5000Pa强劲吸力，支持APP远程控制与语音联动。',
          en: 'Equipped with LDS laser navigation and 5000Pa strong suction, supporting APP remote control and voice integration.',
          es: 'Equipado con navegación láser LDS y succión fuerte de 5000Pa, con soporte para control remoto por APP e integración de voz.',
          pt: 'Equipado com navegação a laser LDS e sucção forte de 5000Pa, com suporte para controle remoto por APP e integração de voz.'
        }
      },
      {
        slug: 'wash-vac-pro',
        productCode: 'P-4002',
        categorySlug: 'robot-mops',
        priceUsd: new Prisma.Decimal('699.00'),
        coverImageUrl: '/show/robot_floor_cleaner.png',
        isRecommended: false,
        sortOrder: 8,
        publishedAt: new Date('2026-04-29T00:00:00.000Z'),
        names: {
          zh: 'WashVac Pro 扫拖一体机',
          en: 'WashVac Pro',
          es: 'WashVac Pro',
          pt: 'WashVac Pro'
        },
        intros: {
          zh: '扫拖一体，自清洁基站。',
          en: 'Sweep and mop combo with self-cleaning dock.',
          es: 'Combo barre y friega con base de autolimpieza.',
          pt: 'Combo varre e esfrega com base de autolimpeza.'
        },
        details: {
          zh: '先扫后拖，配备自动洗拖布与热风烘干基站，真正解放双手。',
          en: 'Sweep then mop, with automatic mop washing and hot air drying dock, truly hands-free.',
          es: 'Barre y luego friega, con base de lavado automático de trapeador y secado con aire caliente, verdaderamente manos libres.',
          pt: 'Varre e depois esfrega, com base de lavagem automática do esfregão e secagem com ar quente, verdadeiramente sem usar as mãos.'
        }
      },
      {
        slug: 'window-bot-lite',
        productCode: 'P-1003',
        categorySlug: 'residential-window-robots',
        priceUsd: new Prisma.Decimal('299.00'),
        coverImageUrl: '/show/robot_window_cleaner.png',
        isRecommended: false,
        sortOrder: 9,
        publishedAt: null,
        names: {
          zh: 'WindowBot Lite 擦窗机器人',
          en: 'WindowBot Lite',
          es: 'WindowBot Lite',
          pt: 'WindowBot Lite'
        },
        intros: {
          zh: '入门款擦窗机器人，轻松搞定日常清洁。',
          en: 'Entry-level window cleaning robot for everyday cleaning.',
          es: 'Robot limpiacristales de nivel básico para limpieza diaria.',
          pt: 'Robô de limpeza de vidros de nível básico para limpeza diária.'
        },
        details: {
          zh: '后台草稿商品示例，用于演示编辑和发布流程。',
          en: 'A draft product example for the admin flow.',
          es: 'Un producto borrador para el flujo administrativo.',
          pt: 'Um exemplo de produto em rascunho para o fluxo administrativo.'
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
          status: product.publishedAt ? 'published' : 'draft',
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
          imageUrl: '/show/robot_humanoid.png',
          targetType: 'category',
          targetId: categories.get('humanoid-robots'),
          targetUrl: null,
          sortOrder: 1,
          isActive: true
        },
        {
          imageUrl: '/show/robot_drone.png',
          targetType: 'category',
          targetId: categories.get('drones'),
          targetUrl: null,
          sortOrder: 2,
          isActive: true
        },
        {
          imageUrl: '/show/robot_window_cleaner.png',
          targetType: 'category',
          targetId: categories.get('window-cleaning-robots'),
          targetUrl: null,
          sortOrder: 3,
          isActive: true
        },
        {
          imageUrl: '/show/robot_floor_cleaner.png',
          targetType: 'category',
          targetId: categories.get('vacuum-robots'),
          targetUrl: null,
          sortOrder: 4,
          isActive: true
        },
        {
          imageUrl: '/show/robot_industrial_arm.png',
          targetType: 'category',
          targetId: categories.get('humanoid-robots'),
          targetUrl: null,
          sortOrder: 5,
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
