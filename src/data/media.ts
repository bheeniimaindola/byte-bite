import octopusImg from '../assets/images/hero_binchotan_octopus_1794653748767.jpg';
import uniImg from '../assets/images/dish_uni_handroll_1794653748143.jpg';
import duckImg from '../assets/images/dish_dry_aged_duck_1794653748535.jpg';
import noodleImg from '../assets/images/dish_chili_crab_noodle_1794653749295.jpg';
import milleImg from '../assets/images/dish_black_sesame_mille_1794653749766.jpg';
import crudoImg from '../assets/images/dish_natural_wine_crudo_1794653750374.jpg';
import { CulinaryDrop } from '../types/gastronomy';

export const DISH_IMAGES: Record<CulinaryDrop['imageKey'], string> = {
  octopus: octopusImg,
  uni: uniImg,
  duck: duckImg,
  noodle: noodleImg,
  mille: milleImg,
  crudo: crudoImg,
};
