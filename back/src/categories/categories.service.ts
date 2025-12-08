import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ReorderCategoriesDto, UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  private async findCategory(categoryId: string) {
    const categoryFound = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: { children: true },
    });

    if (!categoryFound) {
      throw new BadRequestException('Categoria no encontrada');
    }
    return categoryFound;
  }

  async create(dto: CreateCategoryDto) {
    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new BadRequestException('La categoría padre no existe');
      }
    }

    const posExists = await this.prisma.category.findFirst({
      where: { position: dto.position, parentId: dto.parentId || null },
    });

    if (posExists) {
      throw new BadRequestException(`La posicion ${dto.position} ya existe`);
    }

    const nameExists = await this.prisma.category.findFirst({
      where: { name: dto.name, parentId: dto.parentId || null },
    });

    if (nameExists) {
      throw new BadRequestException(`La categoria ${dto.name} ya existe`);
    }
    return this.prisma.category.create({
      data: {
        name: dto.name,
        position: dto.position,
        parentId: dto.parentId,
      },
    });
  }

  ///me trae categorias null y con numero y subcategorias
  async findAll() {
    return this.prisma.category.findMany({
      include: {
        parent: true,
        children: true, // para mostrar el contador "7 subcategorías"
      },
      orderBy: { position: 'asc' },
    });
  }

  //me trae categorias por categorias padre con sus hijos
  async findAllTree() {
    return this.prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: true,
      },
      orderBy: { position: 'asc' },
    });
  }

  async findOne(categoryId: string) {
    return await this.findCategory(categoryId);
  }

  async update(id: string, dto: UpdateCategoryDto) {
  
  const currentCategory = await this.findCategory(id);

  if (dto.parentId !== undefined && dto.parentId !== currentCategory.parentId) {
    
    // última posición del nuevo padre
    const lastItem = await this.prisma.category.findFirst({
      where: { parentId: dto.parentId },
      orderBy: { position: 'desc' }, 
    });

    dto.position = lastItem ? lastItem.position + 1 : 1;
  }

  return this.prisma.category.update({
    where: { id },
    data: dto,
  });
}

async reorder(dto: ReorderCategoriesDto) {
  const updates = dto.categoryIds.map((id, index) => 
    this.prisma.category.update({
      where: { id },
      data: { position: index + 1 }, 
    })
  );

  return await this.prisma.$transaction(updates);
}
  //eliminar categoria
  async remove(categoryId: string, force: boolean) {
    const categoryFound = await this.prisma.category.findFirst({
      where: { id: categoryId },
      include: { children: true },
    });

    if (!categoryFound) {
      throw new BadRequestException('No se encontró el id');
    }
    if (categoryFound.children.length > 0 && force === false) {
      const childrenNames = categoryFound.children.map((c) => c.name);

      throw new BadRequestException({
        statusCode: 400,
        message: 'Esta categoría tiene subcategorías',
        error: 'Bad Request',
        children: childrenNames,
      });
    }

    await this.prisma.category.delete({ where: { id: categoryId } });

    return {
      message: 'Cateogria eliminada',
      data: {
        categoryFound,
      },
    };
  }
}
