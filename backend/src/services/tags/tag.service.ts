import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { Tag } from "../../database/models/tag.model.js";
import { inject } from "@adonisjs/fold";

@inject()
export class TagService {
  private tagRepository: EntityRepository<Tag>;
  public constructor(private em: EntityManager) {
    this.tagRepository = this.em.getRepository(Tag);
  }

  /**
   * Get all tags from the database
   */
  public async getAllTags(): Promise<Tag[]> {
    return await this.tagRepository.findAll();
  }

  /**
   * Create a new tag
   * @param name name of the tag
   */
  public async createTag(name: string): Promise<Tag> {
    const tag = new Tag();
    tag.name = name;
    return this.tagRepository.create(tag);
  }

  /**
   * Find a tag by its id
   * @param id id of the tag to find
   */
  public async findTagById(id: number): Promise<Tag | null> {
    return await this.tagRepository.findOne({ id });
  }

  /**
   * Find a tag by its name
   * @param name name of the tag
   */
  public async findTagByName(name: string): Promise<Tag | null> {
    return await this.tagRepository.findOne({ name });
  }

  /**
   * Delete a tag from the database
   * @param id id of the tag to delete
   */
  public async deleteTag(id: number): Promise<void> {
    await this.tagRepository.nativeDelete(id);
  }
}
